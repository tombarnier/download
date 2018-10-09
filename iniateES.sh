#!/bin/bash

curl -X DELETE http://localhost:9200/series

curl -X PUT http://localhost:9200/series

curl -H "Content-Type: application/json" -X PUT http://localhost:9200/series/_mapping/doc -d \
'{
	"properties": {
		"name": {
			"type": "text",
			"fielddata": true
		}
	}
}'

