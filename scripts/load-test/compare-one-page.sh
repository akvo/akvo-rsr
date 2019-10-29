## Checks that the output of two RSR servers is the same, and not a lot slower (1 sec max)

## WARN: rsr1 and rsr domains hardcoded
## WARN: using gdate, which is MacOS specific (replace with "date" for Linux)

clean () {
cat $1 | sed -e 's/rsr1.akvotest/rsr.akvo/g' \
             -e "/getElementById('akvo_map/d" \
             -e '/csrfmiddlewaretoken/d' \
             -e '/robots/d' \
             -e '/sentry_dsn/d' \
             -e '/\/static\/rsr\/dist/d' \
             -e '/div class= "akvo_map"/d' \
             -e '/styles\/rsr.min/d' \
             -e '/^[[:space:]]*$/d' \
             > $1.clean
}

do_get () {
 res1=$(gdate +%s%3N)
 wget $1 -O $2 -q 
 res2=$(gdate +%s%3N)
 dt=$(echo "$res2 - $res1" | bc)
}

do_get https://rsr1.akvotest.org/$1 test.html
test_version_time=$dt
do_get https://rsr.akvo.org/$1 prod.html
production_version_time=$dt
clean prod.html
clean test.html

echo "$test_version_time $production_version_time $(($production_version_time - $test_version_time)) $1"
if [[ $(diff prod.html.clean test.html.clean) ]]; then
	echo "not equal"
	if [[ "$2" -eq "diff" ]]; then
	  diff prod.html.clean test.html.clean
	fi
	exit 1
fi

if [[ $(($production_version_time - $test_version_time)) -lt -1000 ]]; then
        echo "slower!"
	exit 1	
fi
