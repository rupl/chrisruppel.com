#!/bin/bash

## declare an array variable
declare -a arr=("" "\@640" "\@320")

## now loop through the above array
for i in "${arr[@]}"
do
  git s | grep _img | sed "s/_img\/travel/_site\/img\/travel$i/g" | sed 's/[?ADM ]//g' | xargs -n1 rm
done
