(import '(java.time LocalTime Duration)
  '(java.time.format DateTimeFormatter))

(def r (slurp "dbcalls.latest.txt"))


;; Parses a docker-compose db stats file and groups calls by SQL statement, adding up the time reported by Django
(->>
  (clojure.string/split-lines r)
  (filter #(re-find #"SELECT" %))
  (map #(clojure.string/split % #" +"))
  (map (partial drop 6))
  (group-by rest)
  (map (fn [[query v]]
         {:query (clojure.string/join " " query)
          :c (count v)
          :times (reduce + (map (comp
                                  #(if (zero? %) 0.001M %)
                                  #(BigDecimal. %)
                                  (partial re-find #"[0-9]+\.[0-9]+")
                                  first) v))}))
  (sort-by :times)
  reverse
  (take 3)
  ;(map :times)
  ;(apply +)
  )

;; Same as before, but instead of using the time reported by Django, it uses the time difference between consecutive
;; log lines to know how long it took to process a DB response.
;; WARN: last sql query is lost
(def lines-slow (let [lines (->> (clojure.string/split-lines r)
                              (filter #(re-find #"SELECT" %))
                              (drop 1)
                              (map #(clojure.string/split % #" +"))
                              (map (partial drop 4))
                              (map (fn [l]
                                     (let [log-time (LocalTime/from (.parse (DateTimeFormatter/ofPattern "HH:mm:ss,SSS") (first l)))
                                           db-call-time (as-> l x
                                                          (nth x 2)
                                                          (re-find #"[0-9]+\.[0-9]+" x)
                                                          (BigDecimal. x)
                                                          (* x 1000))]
                                       {:query-start-time (.minus log-time (long db-call-time) java.time.temporal.ChronoUnit/MILLIS)
                                        :log-time log-time
                                        :db-call-time db-call-time
                                        :sql (clojure.string/join " " (butlast (drop 3 l)))}))))
                      start-time (:query-start-time (first lines))
                      ]
                  (->> lines
                    (partition 2 1)
                    (map (fn [[{:keys [query-start-time sql db-call-time]} {next-line-start-time :query-start-time}]]
                           {:duration (Duration/between query-start-time next-line-start-time)
                            :since-start (Duration/between start-time query-start-time)
                            :db-call-time db-call-time
                            :sql sql})))))

{:total-time (reduce
               (fn [x v]
                 (.plus x v))
               (map :duration lines-slow))
 :query-time (reduce
               (fn [x v]
                 (+ x v))
               (map :db-call-time lines-slow))}

;; most expensive sql+processing time queries
(->>
  (group-by :sql lines-slow)
  (map (fn [[query v]]
         {:query query
          :c (count v)
          :times (reduce
                   (fn [x v]
                     (.plus x v))
                   (map :duration v))}))
  (sort-by :times))
