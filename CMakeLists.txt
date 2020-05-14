cmake_minimum_required(VERSION 3.15)

project(glub VERSION 1.0.0 DESCRIPTION "Easy to use CMake boilerplate for developing OpenGL programs in C++" LANGUAGES CXX)

find_package(Git)

if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
    message(STATUS "Updating git submodules...")

    set(SUBMODULES lib/glew;lib/glfw;lib/stb;lib/glm;)
    set(REPOSITORIES https://github.com/Perlmint/glew-cmake.git;https://github.com/glfw/glfw.git;https://github.com/nothings/stb.git;https://github.com/g-truc/glm.git;)

    foreach(UPD_SUB IN LISTS SUBMODULES)
        message(STATUS "Updating ${UPD_SUB}...")

        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive -- ${UPD_SUB} WORKING_DIRECTORY ${PROJECT_SOURCE_DIR} RESULT_VARIABLE GIT_SUBMOD_RESULT)

        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            list(FIND SUBMODULES ${UPD_SUB} SUB_INDEX)
            list(GET REPOSITORIES ${SUB_INDEX} SUB_URL)

            execute_process(COMMAND ${GIT_EXECUTABLE} submodule add ${SUB_URL} ${UPD_SUB} WORKING_DIRECTORY ${PROJECT_SOURCE_DIR})
            execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive -- ${UPD_SUB} WORKING_DIRECTORY ${PROJECT_SOURCE_DIR} RESULT_VARIABLE GIT_SUBMOD_RESULT)

            if(NOT GIT_SUBMOD_RESULT EQUAL "0")
                message(WARNING "Unable to update submodule ${UPD_SUB}")
            endif()
        endif()

    endforeach()
else()
    message(WARNING "Unable to update git submodules, please update them manually.")
endif()


message(STATUS "Setting up glew...")
add_subdirectory(lib/glew/build/cmake)
add_compile_definitions(GLEW_STATIC GLEW)
include_directories(lib/glew/include)
message(STATUS "Setting up glfw...")
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
add_subdirectory(lib/glfw)
add_compile_definitions(GLFW)
include_directories(lib/glfw/include)
message(STATUS "Setting up glm...")
include_directories(lib/glm/glm)
message(STATUS "Setting up stb...")
include_directories(lib/stb)

if(EXISTS res)
    message(STATUS "Copying resources...")
    file(COPY res DESTINATION ${CMAKE_BINARY_DIR})
endif()

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
file(GLOB_RECURSE SRC_FILES "./src/*.h" "./src/*.cpp")
add_executable(glub ${SRC_FILES})

if (UNIX)
    target_compile_options(glub PUBLIC -Wall -Wextra -pedantic)
elseif (WIN32)
    target_compile_options(glub PUBLIC)
    set_target_properties(glub PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE)
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)
target_link_libraries(glub OpenGL::GL)
target_link_libraries(glub glfw)
target_link_libraries(glub glew)
