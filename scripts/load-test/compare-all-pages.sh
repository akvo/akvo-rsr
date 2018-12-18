## Compare the output of all urls found in the cloudVps log file
## Saves the ones that are different in a file
for i in `cat cloudVps.logs.txt | grep " 200 " | grep GET | grep -v "Monitoring" | cut -f 7 -d\ `; do
	sh compare-one-page.sh $i
	if [ ! $? -eq 0 ]; then
		echo $i >> different.txt
	fi
done
