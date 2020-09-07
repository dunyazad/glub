const DEFAULT_NAME = "glub", DEFAULT_VERSION = "1.0.1", DEFAULT_DESCRIPTION = "Simple CMake setup for developing OpenGL programs in C++";
const rawData = localStorage.getItem('libData'), rawInfo = localStorage.getItem('projectInfo');
const cmakeKeywords = [ "COMMAND ", "VERSION ", "DESCRIPTION ", "LANGUAGES ", "AND ", "EXISTS ", "STATUS ", " IN ", "LISTS ", "WORKING_DIRECTORY", "RESULT_VARIABLE", "NOT ", " EQUAL ", "FIND ", "GET ", "WARNING ", "COPY ", "DESTINATION ", "CMAKE_CXX_STANDARD", "GLOB ", "GLOB_RECURSE ", "UNIX", "WIN32", "PUBLIC", "PROPERTIES", "COMPILE_DEFINITIONS", "BUILDER_STATIC_DEFINE", "FATAL_ERROR ", " REQUIRED", "OFF ", " ON", "CACHE ", "BOOL ", " FORCE" ];
let data = {}, projectInfo = { name: "", version: "", description: "" }, useHttps = true;

if (rawInfo) {
    projectInfo = JSON.parse(rawInfo);
}
