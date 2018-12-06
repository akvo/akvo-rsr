## For a given db call log (obtained with request.sh), print some basic stats

cat $1| grep SELECT | grep utils | tr -s " " | cut -f 8- -d\ | sort | uniq -c | sort -n
cat $1| grep SELECT | grep utils | wc -l 


