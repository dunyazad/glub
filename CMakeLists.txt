cmake_minimum_required(VERSION 3.15)

project(OpenGL-Boilerplate VERSION 1.0 DESCRIPTION "Simple CMake setup for developing OpenGL programs in C++" LANGUAGES CXX)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(lib/glfw)
include_directories(lib/glfw/include)

set(CMAKE_CXX_STANDARD 17)
add_executable(OpenGL-Boilerplate ./src/main.cpp)
target_compile_options(OpenGL-Boilerplate PUBLIC -Wall -Wextra -pedantic)

find_package(OpenGL REQUIRED)
target_link_libraries(OpenGL-Boilerplate OpenGL::GL)

target_link_libraries(OpenGL-Boilerplate glfw)