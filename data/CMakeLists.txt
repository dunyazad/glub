cmake_minimum_required(VERSION 3.15)

project(#[[name]] VERSION #[[version]] DESCRIPTION "#[[description]]" LANGUAGES CXX)#[[submodulesUpdate]]#[[usedLibs]]
#[[libMacros]]

if(UNIX)
	add_compile_definitions(UNIX)
elseif(WIN32)
	add_compile_definitions(WINDOWS)
else()
	message(FATAL_ERROR "Detected platform is not supported!")
endif()

set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})
#[[setup]]
if(EXISTS ${PROJECT_SOURCE_DIR}/#[[resPath]])
	message(STATUS "Copying resources...")
	file(COPY ${PROJECT_SOURCE_DIR}/#[[resPath]] DESTINATION ${CMAKE_BINARY_DIR}/#[[resPath]])
endif()

message(STATUS "Setting up build options...")
file(GLOB_RECURSE SRC_FILES "./#[[srcPath]]*.h" "./#[[srcPath]]*.cpp")
#[[addTarget]]

if(UNIX)
	target_compile_options(#[[name]] PUBLIC -Wall -Wextra -pedantic -lX11 -lGL#[[unixCompileOptions]])
elseif(WIN32)
	target_compile_options(#[[name]] PUBLIC /Wall#[[winCompileOptions]])
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)
target_link_libraries(#[[name]] OpenGL::GL)
#[[linkLibs]]