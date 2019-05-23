(ns parse_pg_dump
  (:require [clojure.string :as str]
            [clojure.data :as data]
            [medley.core :as medley]))

(defn cleanup-object-name [s]
  (if-let [version-str (second (re-matches #".*(_[a-f0-9]*[0-9]+[a-f0-9]*).*" s))]
    (str/replace-first s version-str "")
    s))

(defn check-views-are-the-same [prod correct]
  (let [view (fn [c] (set (filter #(= :create-view (:type %)) c)))]
    (assert (= (view prod) (view correct))
      "Expect views to be identical")))

(defn indices-diff [prod correct]
  (let [indices (fn [c]
                  (->> c
                    (filter #(= :create-index (:type %)))
                    (map #(select-keys % [:related-table :idx-fields]))
                    (group-by :related-table)
                    (medley/map-vals (fn [c] (set (map :idx-fields c))))))
        ;; indices is a map of table to set of index-fields
        prod-indices (indices prod)
        correct-indices (indices correct)
        [to-delete to-create _] (data/diff prod-indices correct-indices)
        reconstruct (fn [full-objs partial-objs]
                      (filter
                        (fn [index]
                          (and
                            (= :create-index (:type index))
                            ((get partial-objs (:related-table index) #{}) (:idx-fields index))))
                        full-objs))]
    {:delete-index (reconstruct prod to-delete)
     :create-index (reconstruct correct to-create)}))

(defn unique-indices-diff [prod correct]
  (assert
    (empty? (->> correct (filter #(= :create-unique (:type %)))))
    "we do not expect the new schema to have any create-unique-index")
  ;; New Django no longer use unique indices, they are all replaced for uniqueness constraints
  ;; See table tastypie_apikey for an example
  {:delete-unique-index (filter #(= :create-unique (:type %)) prod)})

(defn tables [c]
  (filter #(= :create-table (:type %)) c))

(defn tables-diff [prod correct]
  (let [tables (fn [c]
                 (->>
                   (tables c)
                   (map :object)
                   set))
        prod-tables (tables prod)
        correct-tables (tables correct)
        [to-delete to-create _] (data/diff prod-tables correct-tables)
        reconstruct (fn [full-objs partial-objs]
                      (filter
                        (fn [table]
                          (and
                            (= :create-table (:type table))
                            (partial-objs (:object table))))
                        full-objs))]
    (assert (empty? to-create) "We should not need to create new tables")
    {:tables-to-delete (reconstruct prod to-delete)}))

(defn alter-sequences-diff [prod correct]
  ;; Ignoring alter-sequences because they seem to have no changes.
  (second (data/diff
            (->>
              prod
              (filter #(= :alter-sequence (:type %)))
              set)
            (->>
              correct
              (filter #(= :alter-sequence (:type %)))
              set))))

(defn sequences-diff [prod correct]
  (let [db-sequences (fn [c]
                       (->> c
                         (filter #(= :create-sequence (:type %)))
                         set))
        prod-seqs (db-sequences prod)
        correct-seqs (db-sequences correct)
        [to-delete to-create _] (data/diff prod-seqs correct-seqs)
        {deleted-tables :tables-to-delete} (tables-diff prod correct)]
    (assert (empty? to-create) "No new sequences should be needed")
    {:delete-sequence (->> to-delete
                        (map (fn [{seq-name :object :as db-seq}]
                               (let [table-owner (medley/find-first
                                                   (fn [{sql :sql}]
                                                     (str/includes? sql seq-name))
                                                   (tables prod))]
                                 (assert (or
                                           (nil? table-owner)
                                           ((set deleted-tables) table-owner))
                                   "Sequence should be related to a table to be deleted or not related at all")
                                 (assoc db-seq :table-deleted table-owner)))))}))

(defn alter-table-diff [prod correct]
  (let [unique-slots #(select-keys % [:foreign-table :idx-fields :sub-type :related-table])
        alters (fn [c] (->>
                         c
                         (filter #(= :alter-table (:type %)))
                         (remove (fn [{sql :sql}] (str/includes? sql "ALTER COLUMN id SET DEFAULT nextval")))
                         (map unique-slots)
                         set))
        [to-delete to-create _] (data/diff
                                  (alters prod) (alters correct))
        reconstruct (fn [full-objs partial-objs]
                      (filter
                        (fn [alter-table]
                          (and
                            (= :alter-table (:type alter-table))
                            (partial-objs (unique-slots alter-table))))
                        full-objs))

        deleted-tables-names (->>
                               (tables-diff prod correct)
                               :tables-to-delete
                               (map :object)
                               set)

        important-slots-for-unique-indices #(select-keys % [:idx-fields :related-table])

        unique-index-to-delete (->>
                                 (unique-indices-diff prod correct)
                                 :delete-unique-index
                                 (map important-slots-for-unique-indices)
                                 set)

        deleted-index (->>
                        (indices-diff prod correct)
                        :delete-index
                        (map important-slots-for-unique-indices)
                        set)]
    (assert (empty? (->>
                      (reconstruct prod to-delete)
                      (remove (fn [{related-table :related-table}]
                                (deleted-tables-names related-table))))) "It seems to be empty. All alter-table are for tables to be deleted")
    {:alter-to-apply (->>
                       (reconstruct correct to-create)
                       (map (fn [x]
                              (case (:sub-type x)

                                :unique
                                (let [x-slots (important-slots-for-unique-indices (update x :idx-fields #(str/join " " %)))]
                                  (assoc x :subsub-type
                                           (cond
                                             (unique-index-to-delete x-slots)
                                             :unique-index-converted-to-constraint

                                             (deleted-index x-slots)
                                             :non-unique-index-now-is-unique

                                             :default (assert false "Unknown case"))))

                                :foreign-key (assoc x :subsub-type :new-foreign-key)
                                :default (assert false "Unknown subtype"))))
                       )}))

(defn parse-type [type tokens]
  (case type
    :create-index {:related-table (nth tokens 4)
                   :idx-fields (str/join " " (drop 7 tokens))}
    :create-unique {:related-table (nth tokens 5)
                    :idx-fields (str/join " " (drop 8 tokens))}
    :alter-table (merge {:related-table (nth tokens 3)
                         :object (cleanup-object-name (nth tokens 6))}
                   (case (nth tokens 7)
                     "PRIMARY" {:idx-fields (drop 9 tokens)
                                :sub-type :primary-index}
                     "UNIQUE" {:idx-fields (drop 8 tokens)
                               :sub-type :unique}
                     "FOREIGN" {:sub-type :foreign-key
                                :idx-fields (let [value (nth tokens 9)]
                                              (assert (str/ends-with? value ")"))
                                              value)
                                :foreign-table (let [value (nth tokens 11)]
                                                 (assert (str/ends-with? value ")"))
                                                 value)}
                     "SET" (when-not (and
                                       (= "DEFAULT" (nth tokens 8))
                                       (str/starts-with? (nth tokens 9) "nextval("))
                             (throw (ex-info "Unexpected SET clause"
                                      {:type type
                                       :tokens (str/join " " tokens)})))))
    :alter-sequence {:related-table (if-let [related-table (second (str/split (nth tokens 5) #"\."))]
                                      related-table
                                      (assert false (str "Unexpected alter sequence format: " tokens)))}
    nil))

(defn parse [file]
  (->>
    (slurp file)
    str/split-lines
    (remove (fn [s] (str/starts-with? s "-")))
    (remove (fn [s] (str/starts-with? s "SE")))
    (remove str/blank?)
    (partition-by
      (let [x (atom 0)]
        (fn [s] (if-not (or
                          (str/starts-with? s " ")
                          (str/starts-with? s ");"))
                  (swap! x inc)
                  @x))))
    (map (fn [xs]
           (str/replace (apply str xs) #" +" " ")))
    (map (fn [s]
           (let [tokens (str/split s #" ")
                 type (keyword (str/lower-case (str/join "-" (take 2 tokens))))]
             (merge
               {:type type
                :object (cleanup-object-name (if (#{:alter-table
                                                    :create-unique} type)
                                               (nth tokens 3)
                                               (nth tokens 2)))
                :sql s}
               (parse-type type tokens)))))))

(spit "migration-script.sql"
  (with-out-str
    (let [prod (parse "prod.schema")
          correct (parse "clean.schema")]
      (check-views-are-the-same prod correct)

      (println "")
      (println "-----")
      (println "")
      (doseq [old-index (:delete-unique-index (unique-indices-diff prod correct))]
        (println "DROP INDEX" (:object old-index) ";"))

      (let [{:keys [delete-index create-index]} (indices-diff prod correct)]
        (println "")
        (println "-----")
        (println "")
        (doseq [to-delete delete-index]
          (println "DROP INDEX" (:object to-delete) ";"))
        (println "")
        (println "-----")
        (println "")
        (doseq [to-create create-index]
          (println (:sql to-create))))

      (println "")
      (println "-----")
      (println "")
      (doseq [old-table (:tables-to-delete (tables-diff prod correct))]
        (println "DROP TABLE" (:object old-table) ";"))
      (println "")
      (println "-----")
      (println "")
      (doseq [old-seq (:delete-sequence (sequences-diff prod correct))]
        (println "DROP SEQUENCE" (:object old-seq) ";"))


      (println "")
      (println "-- Fixing data issues")
      (println "")
      ;; select iati_org_id, count(*) from rsr_organisation group by iati_org_id order by count(*) DESC;
      (println "UPDATE rsr_organisation SET iati_org_id=NULL WHERE iati_org_id='';")

      ;; select id,primary_location_id from rsr_organisation WHERE primary_location_id IS NOT NULL AND NOT exists (select 1 from rsr_organisationlocation where id=primary_location_id);
      (println "UPDATE rsr_organisation SET primary_location_id=NULL WHERE primary_location_id=0;")

      ;; select id,primary_location_id from rsr_project WHERE primary_location_id IS NOT NULL AND NOT exists (select 1 from rsr_projectlocation where id=primary_location_id)
      (println "UPDATE rsr_project SET primary_location_id=NULL WHERE primary_location_id=455580;")

      (println "")
      (println "-----")
      (println "")
      (doseq [new-constraint (:alter-to-apply (alter-table-diff prod correct))]
        (println "--" (:subsub-type new-constraint))
        (println (:sql new-constraint))))))

(comment
  (spit "delete-all-data.sql"
    (with-out-str
      (doseq [t
              (map
                :object
                (tables (parse "clean.schema")))]
        (println "DELETE from" t ";")))))