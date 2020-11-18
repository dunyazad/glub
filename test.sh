mkdir -p test/src test/build
touch test/CMakeLists.txt test/src/main.cpp

while read libraries; do
  node test/genProject.mjs $libraries
  cd test/build
  cmake ../
  cmake --build .
  cd ../../
done < test/testCombos.txt
