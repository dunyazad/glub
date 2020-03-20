cmake_minimum_required(VERSION 3.15)

message(STATUS "Updating submodules...")
execute_process(COMMAND git submodule update --init --recursive WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} RESULT_VARIABLE GIT_SUB_RESULT)
if(NOT GIT_SUB_RESULT EQUAL "0")
    message(FATAL_ERROR "\"git submodule update --init --recursive\" failed with ${GIT_SUB_RESULT}")
endif()

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${CMAKE_SOURCE_DIR}/build/debug)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${CMAKE_SOURCE_DIR}/build/release)

message(STATUS "Initializing glew...")
if (UNIX)
    execute_process(COMMAND make glew.lib WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew RESULT_VARIABLE GLEW_BUILD_RESULT)
    if(NOT GLEW_BUILD_RESULT EQUAL "0")
        message(FATAL_ERROR "\"make glew.lib\" for GLEW failed with ${GLEW_BUILD_RESULT}")
    endif()
elseif (WIN32)
    
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

project(OpenGL-Boilerplate VERSION 1.0 DESCRIPTION "Simple CMake setup for developing OpenGL programs in C++" LANGUAGES CXX)

message(STATUS "Setting up glfw...")
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(lib/glfw)
include_directories(lib/glfw/include lib/glew/include)

message(STATUS "Setting up glew...")
add_library(glew STATIC IMPORTED)
set_target_properties(glew PROPERTIES INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/lib/glew/include)

if (UNIX)
    set_target_properties(glew PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/lib/glew/lib/libGLEW.a)
elseif (WIN32)
    if ("${CMAKE_SIZEOF_VOID_P}" EQUAL "8")
        set_target_properties(glew PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/lib/glew/lib/Release/x64/glew32s.lib)
    else ()
        set_target_properties(glew PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/lib/glew/lib/Release/Win32/glew32s.lib)
    endif()
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

add_compile_definitions(GLEW_STATIC)

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
add_executable(OpenGL-Boilerplate ./src/main.cpp)

if (UNIX)
    target_compile_options(OpenGL-Boilerplate PUBLIC -Wall -Wextra -pedantic)
elseif (WIN32)
    target_compile_options(OpenGL-Boilerplate PUBLIC)
    set_target_properties(OpenGL-Boilerplate PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE)
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)
target_link_libraries(OpenGL-Boilerplate OpenGL::GL)

target_link_libraries(OpenGL-Boilerplate glfw)
target_link_libraries(OpenGL-Boilerplate glew)
