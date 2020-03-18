cmake_minimum_required(VERSION 3.15)

find_package(Git)
if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
    option(GIT_SUBMODULE "Check submodules during build" ON)
    if(GIT_SUBMODULE)
        message(STATUS "Submodule update")
        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} RESULT_VARIABLE GIT_SUBMOD_RESULT)
        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            message(FATAL_ERROR "\"git submodule update --init\" failed with ${GIT_SUBMOD_RESULT}")
        endif()
    endif()
endif()

execute_process(COMMAND make extensions WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew RESULT_VARIABLE GLEW_EXT_RESULT)
if(NOT GLEW_EXT_RESULT EQUAL "0")
    message(FATAL_ERROR "\"make extensions\" for GLEW failed with ${GLEW_EXT_RESULT}")
endif()

execute_process(COMMAND make glew.lib WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew RESULT_VARIABLE GLEW_BUILD_RESULT)
if(NOT GLEW_BUILD_RESULT EQUAL "0")
    message(FATAL_ERROR "\"make glew.lib\" for GLEW failed with ${GLEW_BUILD_RESULT}")
endif()

project(OpenGL-Boilerplate VERSION 1.0 DESCRIPTION "Simple CMake setup for developing OpenGL programs in C++" LANGUAGES CXX)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(lib/glfw)
include_directories(lib/glfw/include)

add_library(glew STATIC IMPORTED GLOBAL)
set_target_properties(glew PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/lib/glew/lib/libGLEW.a )
set_target_properties(glew PROPERTIES INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/lib/glew/include )

add_compile_definitions(GLEW_STATIC)

set(CMAKE_CXX_STANDARD 17)
add_executable(OpenGL-Boilerplate ./src/main.cpp)
target_compile_options(OpenGL-Boilerplate PUBLIC -Wall -Wextra -pedantic)

find_package(OpenGL REQUIRED)
target_link_libraries(OpenGL-Boilerplate OpenGL::GL)

target_link_libraries(OpenGL-Boilerplate glfw)
target_link_libraries(OpenGL-Boilerplate glew)