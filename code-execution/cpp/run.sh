#!/bin/bash
# Entrypoint for docker container

cd execution

mkdir result
echo ${test_count} > result/test_count.txt

g++ src/main.cpp -o src/main -std=c++11

echo ${time_limit} > result/test_count.txt

echo ${time_limit}

#ulimit -t ${time_limit}

for test_num in $(seq 1 "${test_count}")
do
  src/main tests/in_"${test_num}".txt tests/out_"${test_num}".txt result/result_"${test_num}".txt

#  if [ $? -eq 137 ]; then
#    echo "TLE" > result/result_"${test_num}".txt
#  fi
done