cmake_minimum_required(VERSION 3.15)

project(#[[name]] VERSION #[[version]] DESCRIPTION "#[[description]]" LANGUAGES CXX)#[[submodulesUpdate]]#[[usedLibs]]
#[[libMacros]]
#[[setup]]
if(EXISTS ${PROJECT_SOURCE_DIR}/res)
    message(STATUS "Copying resources...")
    file(COPY ${PROJECT_SOURCE_DIR}/res DESTINATION ${CMAKE_BINARY_DIR})
endif()

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
file(GLOB_RECURSE SRC_FILES "./src/*.h" "./src/*.cpp")
add_executable(#[[name]] #[[execFiles]])

if(UNIX)
    add_compile_options(-g -O0 -fprofile-arcs -ftest-coverage)
    target_compile_options(#[[name]] PUBLIC -Wall -Wextra -pedantic -lX11 -lGL#[[compileOptions]])
else()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)
target_link_libraries(#[[name]] OpenGL::GL)
#[[linkLibs]]