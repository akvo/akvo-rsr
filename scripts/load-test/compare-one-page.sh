## Checks that the output of two RSR servers is the same, and not a lot slower (1 sec max)

## WARN: k8s and k9s domains hardcoded
## WARN: using gdate, which is MacOS specific (replace with "date" for Linux)

clean () {
cat $1 | sed -e 's/k9s/k8s/g' -e "/getElementById('akvo_map/d" -e '/csrfmiddlewaretoken/d' -e '/div class= "akvo_map"/d' -e '/styles\/rsr.min/d' -e '/^[[:space:]]*$/d' > $1.clean
}

do_get () {
 res1=$(gdate +%s%3N)
 wget $1 -O $2 -q 
 res2=$(gdate +%s%3N)
 dt=$(echo "$res2 - $res1" | bc)
}

do_get https://rsr-k9s.akvo.org/$1 k9s
k9s_time=$dt
do_get https://rsr-k8s.akvo.org/$1 k8s
k8s_time=$dt
clean k8s
clean k9s

echo "$k9s_time $k8s_time $(($k8s_time - $k9s_time)) $1"
if [[ $(diff k8s.clean k9s.clean) ]]; then
	echo "not equal"
	exit 1
fi

if [[ $(($k8s_time - $k9s_time)) -lt -1000 ]]; then
        echo "slower!"
	exit 1	
fi
