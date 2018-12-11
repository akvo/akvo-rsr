
# A very basic script that replays the load from an nginx server
# Expects https://github.com/Gonzih/log-replay to be installed
# Expects a nginx log file, see cloudVps.logs.sample.txt for a sample of what right now works

# Convert the cloudVps log file to something  that log-replay can understand
cat cloudVps.logs.txt | grep " 200 " | grep -v "Monitoring" | cut -f 1,4-9 -d\ | sed 's/$/ 16063 0 0 \"0\" 6.228 6.228/' > clean-requests-so-log-replay-understands-them.txt

# Replaying the log. Notice the prefix and log parameters
echo "Starting log replay, tail k8s.results.txt -f | awk '{ printf "%-5s %-.3f   %s\n", \$1, \$3/1000000000, \$4 }'"
~/go/bin/log-replay --file clean-requests-so-log-replay-understands-them.txt --prefix https://rsr-k8s.akvo.org/ --log k8s.results.txt -timeout 300000

# Calculating the 50, 90, 95 and 99 percentile for both the cloudVPS and k8s results
echo "cloudVps stats:"
cat cloudVps.logs.txt | grep "1.1\" 200 " | grep -v "Monitoring" | rev | cut -f 3 -d\  | rev |  sort -n  | awk '{all[NR] = $0} END{print "50%=" all[int(NR*0.50)]  " 90%=" all[int(NR*0.90)]  " 95%=" all[int(NR*0.95)] " 99%=" all[int(NR*0.99)] }'

echo "k8s stats:"
cat k8s.results.txt | cut -f 3 | sort -n  | awk '{all[NR] = $0} END{print "50%=" all[int(NR*0.50)]/1000000  " 90%=" all[int(NR*0.90)]/1000000  " 95%=" all[int(NR*0.95)]/1000000 " 99%=" all[int(NR*0.99)]/1000000 }'