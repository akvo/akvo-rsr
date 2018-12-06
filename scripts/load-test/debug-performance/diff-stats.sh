## Very basic db stats diff

sh stats-db-calls.sh $1 | sort -k 2 > tmp1
sh stats-db-calls.sh $2 | sort -k 2 > tmp2

diff tmp1 tmp2 | vi -

rm tmp1 tmp2




