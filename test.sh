#!/bin/bash

rm -r test/results test/build &> /dev/null
mkdir -p test/src test/build test/results
touch test/CMakeLists.txt test/src/main.cpp
failedCombos=()

while read libraries; do
  node test/genProject.mjs $libraries
  cd test/build

  formattedLibs="${libraries}"

  if [[ -z $formattedLibs ]]
  then
    formattedLibs="no_libs"
  fi

  formattedLibs=$(echo $formattedLibs | tr " " "_")

  printf "Generating cmake cache for %s..." "${formattedLibs}"
  cmake ../ &> "../results/${formattedLibs}-gen-cache.txt"
  if [[ $? -eq 0 ]]
  then
    printf "[OK]\nBuilding %s..." "${formattedLibs}"
    cmake --build . &> "../results/${formattedLibs}-build.txt"

    if [[ $? -eq 0 ]]
    then
      printf "[OK]\n"
    else
      printf "[FAILED]\n"
      failedCombos+=( "${formattedLibs}" )
    fi
  else
    printf "[FAILED]\n"
    failedCombos+=( "${formattedLibs}" )
  fi

  cd ../../
  echo --------------------------------
done < test/testCombos.txt

for failed in "${failedCombos[@]}"
do
  echo -e "${failed} cache generation output\n"
  cat "test/results/${failed}-gen-cache.txt"

  if test -f "test/results/${failed}-build.txt"
  then
    echo -e "\n\n\n${failed} build output\n"
    cat "test/results/${failed}-build.txt"
  fi

  echo --------------------------------
done
