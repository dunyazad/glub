cmake_minimum_required(VERSION 3.15)

project(OpenGL-Boilerplate VERSION 1.0 DESCRIPTION "Simple CMake setup for developing OpenGL programs in C++" LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
add_executable(OpenGL-Boilerplate ./src/main.cpp)
target_compile_options(OpenGL-Boilerplate PUBLIC -Wall -Wextra -pedantic)
