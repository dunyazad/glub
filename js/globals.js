const DEFAULT_NAME = "glub", DEFAULT_VERSION = "1.0.2", DEFAULT_DESCRIPTION = "Easy to use CMake boilerplate for OpenGL development in C++", DEFAULT_SRC_PATH = "src/", DEFAULT_RES_PATH = "res/";
const cmakeKeywords = [ "COMMAND ", "VERSION ", "DESCRIPTION ", "LANGUAGES ", "AND ", "EXISTS ", "STATUS ", " IN ", "LISTS ", "WORKING_DIRECTORY", "RESULT_VARIABLE", "NOT ", " EQUAL ", "FIND ", "GET ", "WARNING ", "COPY ", "DESTINATION ", "CMAKE_CXX_STANDARD", "GLOB ", "GLOB_RECURSE ", "UNIX", "WIN32", "PUBLIC", "PROPERTIES", "COMPILE_DEFINITIONS", "BUILDER_STATIC_DEFINE", "FATAL_ERROR ", " REQUIRED", "OFF ", " ON", "CACHE ", "BOOL ", " FORCE" ];
let data = {}, projectInfo = { name: "", version: "", description: "", srcPath: "", resPath: "", isLibrary: false }, useHttps = true;

try {
	module.exports = {DEFAULT_NAME, DEFAULT_VERSION, DEFAULT_DESCRIPTION, DEFAULT_SRC_PATH, DEFAULT_RES_PATH};
} catch (e) {}