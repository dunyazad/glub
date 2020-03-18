cmake_minimum_required(VERSION 3.15)

message(STATUS "Updating submodules...")
execute_process(COMMAND git submodule update --init --recursive WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} RESULT_VARIABLE GIT_SUB_RESULT)
if(NOT GIT_SUB_RESULT EQUAL "0")
    message(FATAL_ERROR "\"git submodule update --init --recursive\" failed with ${GIT_SUB_RESULT}")
endif()

message(STATUS "Initializing glew...")
if (UNIX)
    execute_process(COMMAND make glew.lib WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew RESULT_VARIABLE GLEW_BUILD_RESULT)
    if(NOT GLEW_BUILD_RESULT EQUAL "0")
        message(FATAL_ERROR "\"make glew.lib\" for GLEW failed with ${GLEW_BUILD_RESULT}")
    endif()
elseif (WIN32)
    execute_process(COMMAND nmake extensions WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew RESULT_VARIABLE GLEW_SLN_RESULT)
    if(NOT GLEW_SLN_RESULT EQUAL "0")
        message(FATAL_ERROR "\"nmake extensions\" for GLEW failed with ${GLEW_SLN_RESULT}")
    endif()

    execute_process(COMMAND msbuild glew.sln WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/lib/glew/build/vc15 RESULT_VARIABLE GLEW_SLN_RESULT)
    if(NOT GLEW_SLN_RESULT EQUAL "0")
        message(FATAL_ERROR "\"msbuild glew.sln\" for GLEW failed with ${GLEW_SLN_RESULT}")
    endif()
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

project(OpenGL-Boilerplate VERSION 1.0 DESCRIPTION "Simple CMake setup for developing OpenGL programs in C++" LANGUAGES CXX)

message(STATUS "Setting up glfw...")
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(lib/glfw)
include_directories(lib/glfw/include)

message(STATUS "Setting up glew...")
add_library(glew STATIC IMPORTED GLOBAL)
set_target_properties(glew PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/lib/glew/lib/libGLEW.a )
set_target_properties(glew PROPERTIES INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/lib/glew/include )

add_compile_definitions(GLEW_STATIC)

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
add_executable(OpenGL-Boilerplate ./src/main.cpp)
target_compile_options(OpenGL-Boilerplate PUBLIC -Wall -Wextra -pedantic)

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)
target_link_libraries(OpenGL-Boilerplate OpenGL::GL)

target_link_libraries(OpenGL-Boilerplate glfw)
target_link_libraries(OpenGL-Boilerplate glew)