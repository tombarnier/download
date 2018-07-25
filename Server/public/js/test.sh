#!/bin/bash
for serie in $1
do
	SAISONS=$(timeout 2 curl -s -L $serie | egrep -o "http[s]*://.*/[0-9a-Z]*.*.html")
	test=$?
	if [ $test -eq 1 ]
	then
		echo "curl retry"
		SAISONS=$(timeout 2 curl -s -L $serie | egrep -o "http[s]*://.*/[0-9a-Z]*.*.html")
		test=$?
		echo $test
	else
		echo $test
	fi
done
