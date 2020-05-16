$(document).ready(() => {
    let projectName = "glub";
    let projectVersion = "1.0.0";
    let projectDescription = "Easy to use CMake boilerplate for developing OpenGL programs in C++";
    let glew = true, glad = false, glfw = true, stb = true, imgui = false, sdl = false, glm = true, mathfu = false, xlib = false, freetype = false;

    $('#glew, #glfw, #stb, #glm').addClass('selected');

    updateResult();

    $('#result').on('click', () => {
        let $temp = $("<textarea style='opacity: 0'>");
        $("body").append($temp);
        $temp.val(getCmakeString()).select();
        document.execCommand("copy");
        $temp.remove();
        let $toast = $("<div class=\"toast\">CMakeLists.txt contents copied to clipboard</div>");
        $("body").append($toast);
        $toast.animate({ right: "20px" }, 180, "swing", () => {
            $toast.animate({ opacity: 0}, 2500, "swing", () => {
                $toast.remove();
            });
        });
    });

    $('#main').on('click', () => {
        let $temp = $("<textarea style='opacity: 0'>");
        $("body").append($temp);

        getMainString().then((data) => {
            $temp.val(data.toString()).select();
            document.execCommand("copy");
            $temp.remove();

            let $toast = $("<div class=\"toast\">main.cpp contents copied to clipboard</div>");
            $("body").append($toast);
            $toast.animate({ right: "20px" }, 180, "swing", () => {
                $toast.animate({ opacity: 0}, 3000, "swing", () => {
                    $toast.remove();
                });
            });
        });
    });

    $('#main').on('mouseover', () => {
        $('#main-tooltip').css({ display: 'block' });
    });

    $('#main').on('mouseout', () => {
        $('#main-tooltip').css({ display: 'none' });
    });

    $('#gh-link').on('mouseover', () => {
        $('#gh-tooltip').css({ display: 'block' });
    });

    $('#gh-link').on('mouseout', () => {
        $('#gh-tooltip').css({ display: 'none' });
    });

    $('#glew').on('click', () => {
        glew = !glew;
        $('#glew').toggleClass('selected');
        glad = false;
        $('#glad').removeClass('selected');     // glad and glew are not compatible together
        updateResult();
    });

    $('#glad').on('click', () => {
        glad = !glad;
        $('#glad').toggleClass('selected');
        glew = false;
        $('#glew').removeClass('selected');     // glad and glew are not compatible together

        if (!sdl) {
            glfw = true;
            $('#glfw').addClass('selected');        // glad requires glad/gl.h and glad/glx.h to be generated in order to work directly with xlib
        }

        if (glad) {
            xlib = false;
        }

        updateResult();
    });

    $('#glfw').on('click', () => {
        glfw = !glfw;
        xlib = !glfw;
        $('#glfw').toggleClass('selected');

        if (!glfw) {
            $('#glad').removeClass('selected');
            glad = false;
        }

        sdl = false;
        $('#sdl').removeClass('selected');

        updateResult();
    });

    $('#stb').on('click', () => {
        stb = !stb;
        $('#stb').toggleClass('selected');
        updateResult();
    });

    $('#imgui').on('click', () => {
        imgui = !imgui;
        $('#imgui').toggleClass('selected');

        if (imgui) {
            if (!glew && !glad) {
                $('#glew').trigger('click');
            }

            if (!sdl && !glfw) {
                $('#glfw').trigger('click');
            }
        }

        updateResult();
    });

    $('#sdl').on('click', () => {
        sdl = !sdl;
        xlib = !sdl;
        $('#sdl').toggleClass('selected');
        glfw = false;
        $('#glfw').removeClass('selected');

        if (!sdl) {
            glad = false;
            $('#glad').removeClass('selected');
        }

        updateResult();
    });

    $('#glm').on('click', () => {
        glm = !glm;
        $('#glm').toggleClass('selected');
        updateResult();
    });

    $('#mathfu').on('click', () => {
        mathfu = !mathfu;
        $('#mathfu').toggleClass('selected');
        updateResult();
    });

    $('#freetype').on('click', () => {
        freetype = !freetype;
        $('#freetype').toggleClass('selected');
        updateResult();
    });

    $('#project-name').on('input', () => {
        projectName = $('#project-name').val();
        projectName = projectName.replace(' ', '-');
        $('#project-name').val(projectName);

        if (!projectName) {
            projectName = "glub";
        }

        updateResult();
    });

    $('#project-version').on('input', () => {
        projectVersion = $('#project-version').val();

        if (!projectVersion) {
            projectVersion = "1.0.0";
        }

        updateResult();
    });

    $('#project-description').on('input', () => {
        projectDescription = $('#project-description').val();

        if (!projectDescription) {
            projectDescription = "Easy to use CMake boilerplate for developing OpenGL programs in C++";
        }

        updateResult();
    });

    function updateResult() {
        $('#result').html(`
        <div>cmake_minimum_required(<span class="blue">VERSION 3.15</span>)</div>
        <br>
        <div>project(<span class="green">${projectName}</span> <span class="blue">VERSION</span> <span class="green">${projectVersion}</span> <span class="blue">DESCRIPTION</span> <span class="green">"${projectDescription}"</span> <span class="blue">LANGUAGES</span> <span class="green">CXX</span>)</div>
        <br>
        <div>find_package(<span class="green">Git</span>)</div>
        <br>
        <div><span class="yellow">if</span>(<span class="green">GIT_FOUND</span> <span class="blue">AND EXISTS</span> <span class="green">"</span><span class="yellow">\${PROJECT_SOURCE_DIR}</span><span class="green">/.git"</span>)</div>
        <div style="margin-left: 20px">message(<span class="blue">STATUS</span> <span class="green">"Updating git submodules..."</span>)</div>
        <div style="margin-left: 20px">set(<span class="yellow">SUBMODULES</span> ${glew ? `<span class="green">lib/glew</span><span class="yellow">;</span>` : ''}${glad ? `<span class="green">lib/glad</span><span class="yellow">;</span>` : ''}${glfw ? `<span class="green">lib/glfw</span><span class="yellow">;</span>` : ''}${stb ? `<span class="green">lib/stb</span><span class="yellow">;</span>` : ''}${imgui ? `<span class="green">lib/imgui</span><span class="yellow">;</span>` : ''}${sdl ? `<span class="green">lib/sdl</span><span class="yellow">;</span>` : ''}${glm ? `<span class="green">lib/glm</span><span class="yellow">;</span>` : ''}${mathfu ? `<span class="green">lib/mathfu</span><span class="yellow">;</span>` : ''}${freetype ? `<span class="green">lib/freetype</span><span class="yellow">;</span>` : ''})</div>
        <div style="margin-left: 20px">set(<span class="yellow">REPOSITORIES</span> ${glew ? 
            `<span class="green">https://github.com/Perlmint/glew-cmake.git</span><span class="yellow">;</span>` : ''}${glad ? 
            `<span class="green">https://github.com/Dav1dde/glad.git</span><span class="yellow">;</span>` : ''}${glfw ? 
            `<span class="green">https://github.com/glfw/glfw.git</span><span class="yellow">;</span>` : ''}${stb ? 
            `<span class="green">https://github.com/nothings/stb.git</span><span class="yellow">;</span>` : ''}${imgui ? 
            `<span class="green">https://github.com/ocornut/imgui.git</span><span class="yellow">;</span>` : ''}${sdl ? 
            `<span class="green">https://github.com/SDL-mirror/SDL.git</span><span class="yellow">;</span>` : ''}${glm ? 
            `<span class="green">https://github.com/g-truc/glm.git</span><span class="yellow">;</span>` : ''}${mathfu ? 
            `<span class="green">https://github.com/google/mathfu.git</span><span class="yellow">;</span>` : ''}${freetype ?
            `<span class="green">git://git.sv.nongnu.org/freetype/freetype2.git</span><span class="yellow">;</span>` : ''})</div>
        <br>
        <div style="margin-left: 20px"><span class="yellow">foreach</span>(<span class="yellow">UPD_SUB</span> <span class="blue">IN LISTS</span> <span class="yellow">SUBMODULES</span>)</div>
        <div style="margin-left: 40px">message(<span class="blue">STATUS</span> <span class="green">"Updating </span><span class="yellow">\${UPD_SUB}</span><span class="green">..."</span>)</div>
        <div style="margin-left: 40px">execute_process(<span class="blue">COMMAND</span> <span class="yellow">\${GIT_EXECUTABLE}</span> <span class="green">submodule update --init --recursive -- </span><span class="yellow">\${UPD_SUB}</span> <span class="blue">WORKING_DIRECTORY</span> <span class="yellow">\${PROJECT_SOURCE_DIR}</span> <span class="blue">RESULT_VARIABLE</span> <span class="yellow">GIT_SUBMOD_RESULT</span>)</div>
        <br>
        <div style="margin-left: 40px"><span class="yellow">if</span>(<span class="blue">NOT</span> <span class="yellow">GIT_SUBMOD_RESULT</span> <span class="blue">EQUAL</span> <span class="green">"0"</span>)</div>
        <div style="margin-left: 60px">list(<span class="blue">FIND</span> <span class="yellow">SUBMODULES \${UPD_SUB} SUB_INDEX</span>)</div>
        <div style="margin-left: 60px">list(<span class="blue">GET</span> <span class="yellow">REPOSITORIES \${SUB_INDEX} SUB_URL</span>)</div>
        <br>
        <div style="margin-left: 60px">execute_process(<span class="blue">COMMAND</span> <span class="yellow">\${GIT_EXECUTABLE}</span> <span class="green">submodule add</span> <span class="yellow">\${SUB_URL} \${UPD_SUB}</span> <span class="blue">WORKING_DIRECTORY</span> <span class="yellow">\${PROJECT_SOURCE_DIR}</span>)</div>
        <div style="margin-left: 60px">execute_process(<span class="blue">COMMAND</span> <span class="yellow">\${GIT_EXECUTABLE}</span> <span class="green">submodule update --init --recursive -- </span><span class="yellow">\${UPD_SUB}</span> <span class="blue">WORKING_DIRECTORY</span> <span class="yellow">\${PROJECT_SOURCE_DIR}</span> <span class="blue">RESULT_VARIABLE</span> <span class="yellow">GIT_SUBMOD_RESULT</span>)</div>
        <div style="margin-left: 60px"><span class="yellow">if</span>(<span class="blue">NOT</span> <span class="yellow">GIT_SUBMOD_RESULT</span> <span class="blue">EQUAL</span> <span class="green">"0"</span>)</div>
        <div style="margin-left: 80px">message(<span class="blue">WARNING</span> <span class="green">"Unable to update submodule</span> <span class="yellow">\${UPD_SUB}</span><span class="green">"</span>)</div>
        <div style="margin-left: 60px"><span class="yellow">endif</span>()</div>
        <div style="margin-left: 40px"><span class="yellow">endif</span>()</div>
        <div style="margin-left: 20px"><span class="yellow">endforeach</span>()</div>
        <div><span class="yellow">else</span>()</div>
        <div style="margin-left: 20px">message(<span class="blue">WARNING</span> <span class="green">"Unable to update git submodules, please update them manually."</span>)</div>
        <div><span class="yellow">endif</span>()</div>
        <br>
        ${glad ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up glad..."</span>)</div>
        <div>add_subdirectory(<span class="green">lib/glad</span>)</div>
        <div>add_compile_definitions(<span class="green">GLAD</span>)</div>
        <div>include_directories(<span class="yellow">\${CMAKE_BINARY_DIR}</span><span class="green"/>lib/glad/include</span>)</div>
        <br>`
            : ''}
        ${glew ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up glew..."</span>)</div>
        <div>add_subdirectory(<span class="green">lib/glew/build/cmake</span>)</div>
        <div>add_compile_definitions(<span class="green">GLEW_STATIC GLEW</span>)</div>
        <div>include_directories(<span class="green">lib/glew/include</span>)</div>
        <br>`
            : ''}
        ${glfw ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up glfw..."</span>)</div>
        <div>set(<span class="green">GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE</span>)</div>
        <div>set(<span class="green">GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE</span>)</div>
        <div>set(<span class="green">GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE</span>)</div>
        <div>add_subdirectory(<span class="green">lib/glfw</span>)</div>
        <div>add_compile_definitions(<span class="green">GLFW</span>)</div>
        <div>include_directories(<span class="green"/>lib/glfw/include</span>)</div>
        <br>`
            : ''}
        ${imgui ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up imgui..."</span>)</div>
        <div>add_subdirectory(<span class="green">lib/imgui lib/imgui/examples</span>)</div>
        <div>add_compile_definitions(<span class="green">IMGUI</span>)</div>
        <div>file(<span class="blue">GLOB</span> <span class="yellow">IMGUI_FILES</span> <span class="green">"./lib/imgui/*.h" "./lib/imgui/*.cpp" "./lib/imgui/examples/imgui_impl_${glfw ? 'glfw' : 'sdl'}.h" "./lib/imgui/examples/imgui_impl_${glfw ? 'glfw' : 'sdl'}.cpp" "./lib/imgui/examples/imgui_impl_opengl3.h" "./lib/imgui/examples/imgui_impl_opengl3.cpp"</span>)</div>
        <br>`
            : ''}
        ${sdl ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up SDL..."</span>)</div>
        <div>add_subdirectory(<span class="green">lib/sdl</span>)</div>
        <div>add_compile_definitions(<span class="green">SDL</span>)</div>
        <div>include_directories(<span class="green"/>lib/sdl/include</span>)</div>
        <br>`
            : ''}
        ${stb ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up stb..."</span>)</div>
        <div>include_directories(<span class="green"/>lib/stb</span>)</div>
        <br>`
            : ''}
        ${glm ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up glm..."</span>)</div>
        <div>add_compile_definitions(<span class="green">GLM</span>)</div>
        <div>include_directories(<span class="green"/>lib/glm/glm</span>)</div>
        <br>`
            : ''}
        ${mathfu ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up MathFu..."</span>)</div>
        <div>add_compile_definitions(<span class="green">MATHFU</span>)</div>
        <div>include_directories(<span class="green"/>lib/mathfu/include</span>)</div>
        <div>include_directories(<span class="green"/>include_directories(lib/mathfu/dependencies/vectorial/include)</span>)</div>
        <br>`
            : ''}
        ${freetype ?
            `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up Freetype..."</span>)</div>
        <div>add_compile_definitions(<span class="green">FREETYPE</span>)</div>
        <div>add_subdirectory(<span class="green"/>lib/freetype</span>)</div>
        <div>include_directories(<span class="green"/>lib/freetype/include</span>)</div>
        <br>`
            : ''}
        <div><span class="yellow">if</span>(<span class="blue">EXISTS</span> <span class="green">res</span>)</div>
        <div style="margin-left: 20px">message(<span class="blue">STATUS</span> <span class="green">"Copying resources..."</span>)</div>
        <div style="margin-left: 20px">file(<span class="blue">COPY</span> <span class="green">res</span> <span class="blue">DESTINATION</span> <span class="yellow">\${CMAKE_BINARY_DIR}</span>)</div>
        <div><span class="yellow">endif</span>()</div>
        <br>
        <div>message(<span class="blue">STATUS</span> <span class="green">"Setting up build options..."</span>)</div>
        <div>set(<span class="blue">CMAKE_CXX_STANDARD</span> <span class="green">17</span>)</div>
        <div>file(<span class="blue">GLOB_RECURSE</span> <span class="yellow">SRC_FILES</span> <span class="green">"./src/*.h" "./src/*.cpp"</span>)</div>
        <div>add_executable(<span class="green">${projectName}</span> <span class="yellow">${"${SRC_FILES}"}${imgui ? " ${IMGUI_FILES}" : ""}</span>)</div>
        <br>
        ${sdl ?
            `<div>target_compile_options(<span class="green">${projectName}</span> <span class="blue">PUBLIC</span> <span class="green">-l SDL2 -lGL</span>)</div>
        <br>`
            : ''}
        <div><span class="yellow">if</span>(<span class="blue">UNIX</span>)</div>
        <div style="margin-left: 20px">target_compile_options(<span class="green">${projectName}</span> <span class="blue">PUBLIC</span> <span class="green">${imgui && glad ? '-DIMGUI_IMPL_OPENGL_LOADER_GLAD ' : ''}-Wall -Wextra -pedantic${xlib ? ' -lX11 -lGL' : ''}</span>)</div>
        <div><span class="yellow">elseif</span>(<span class="blue">WIN32</span>)</div>
        <div style="margin-left: 20px">target_compile_options(<span class="green">${projectName}</span> <span class="blue">PUBLIC</span>)</div>
        <div style="margin-left: 20px">set_target_properties(<span class="green">${projectName}</span> <span class="blue">PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE</span>)</div>
        <div><span class="yellow">else</span>()</div>
        <div style="margin-left: 20px">message(<span class="blue">FATAL_ERROR</span> <span class="green">"Detected platform is not supported!"</span>)</div>
        <div><span class="yellow">endif</span>()</div>
        <br>
        <div>message(<span class="blue">STATUS</span> <span class="green">"Linking..."</span>)</div>
        <div>find_package(<span class="green">OpenGL</span> <span class="blue">REQUIRED</span>)</div>
        ${xlib ? `
        <div>find_package(<span class="green">X11</span> <span class="blue">REQUIRED</span>)</div>` : ''}
        <div>target_link_libraries(<span class="green">${projectName} OpenGL</span>)</div>
        ${xlib ? `
            <div>target_link_libraries(<span class="green">${projectName} X11</span>)</div>` : ''}
        ${glad ?
            `<div>target_link_libraries(<span class="green">${projectName} glad</span> <span class="yellow">\${CMAKE_DL_LIBS}</span>)</div>` : ''}
        ${glew ?
            `<div>target_link_libraries(<span class="green">${projectName} glew</span>)</div>` : ''}
        ${glfw ?
            `<div>target_link_libraries(<span class="green">${projectName} glfw</span>)</div>` : ''}
        ${sdl ?
            `<div>target_link_libraries(<span class="green">${projectName} SDL2</span>)</div>` : ''}
        ${freetype ?
            `<div>target_link_libraries(<span class="green">${projectName} freetype</span>)</div>` : ''}
`);
    }

    function getCmakeString() {
        return `cmake_minimum_required(VERSION 3.15)

project(${projectName} VERSION ${projectVersion} DESCRIPTION "${projectDescription}" LANGUAGES CXX)

find_package(Git)

if(GIT_FOUND AND EXISTS "\${PROJECT_SOURCE_DIR}/.git")
    message(STATUS "Updating git submodules...")

    set(SUBMODULES ${glew ? 'lib/glew;' : ''}${glad ? 'lib/glad;' : ''}${glfw ? 'lib/glfw;' : ''}${stb ? 'lib/stb;' : ''}${imgui ? 'lib/imgui;' : ''}${sdl ? 'lib/sdl;' : ''}${glm ? 'lib/glm;' : ''}${mathfu ? 'lib/mathfu;' : ''}${freetype ? 'lib/freetype;' : ''})
    set(REPOSITORIES ${glew ? 'https://github.com/Perlmint/glew-cmake.git;' : ''}${glad ? 'https://github.com/Dav1dde/glad.git;' : ''}${glfw ? 'https://github.com/glfw/glfw.git;' : ''}${stb ? 'https://github.com/nothings/stb.git;' : ''}${imgui ? 'https://github.com/ocornut/imgui.git;' : ''}${sdl ? 'https://github.com/SDL-mirror/SDL.git;' : ''}${glm ? 'https://github.com/g-truc/glm.git;' : ''}${mathfu ? 'https://github.com/google/mathfu.git;' : ''}${freetype ? 'git://git.sv.nongnu.org/freetype/freetype2.git;' : ''})
    
    foreach(UPD_SUB IN LISTS SUBMODULES)
        message(STATUS "Updating \${UPD_SUB}...")

        execute_process(COMMAND \${GIT_EXECUTABLE} submodule update --init --recursive -- \${UPD_SUB} WORKING_DIRECTORY \${PROJECT_SOURCE_DIR} RESULT_VARIABLE GIT_SUBMOD_RESULT)

        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            list(FIND SUBMODULES \${UPD_SUB} SUB_INDEX)
            list(GET REPOSITORIES \${SUB_INDEX} SUB_URL)

            execute_process(COMMAND \${GIT_EXECUTABLE} submodule add \${SUB_URL} \${UPD_SUB} WORKING_DIRECTORY \${PROJECT_SOURCE_DIR})
            execute_process(COMMAND \${GIT_EXECUTABLE} submodule update --init --recursive -- \${UPD_SUB} WORKING_DIRECTORY \${PROJECT_SOURCE_DIR} RESULT_VARIABLE GIT_SUBMOD_RESULT)

            if(NOT GIT_SUBMOD_RESULT EQUAL "0")
                message(WARNING "Unable to update submodule \${UPD_SUB}")
            endif()
        endif()

    endforeach()
else()
    message(WARNING "Unable to update git submodules, please update them manually.")
endif()

${glad ? `
message(STATUS "Setting up glad...")
    add_subdirectory(lib/glad)
    add_compile_definitions(GLAD)
    include_directories(\${CMAKE_BINARY_DIR}lib/glad/include)` : ''}${glew ? `
    message(STATUS "Setting up glew...")
    add_subdirectory(lib/glew/build/cmake)
    add_compile_definitions(GLEW_STATIC GLEW)
    include_directories(lib/glew/include)` : ''}${glfw ? `
    message(STATUS "Setting up glfw...")
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
add_subdirectory(lib/glfw)
add_compile_definitions(GLFW)
include_directories(lib/glfw/include)` : ''}${imgui ? `
message(STATUS "Setting up imgui...")
    include_directories(lib/imgui lib/imgui/examples)
    add_compile_definitions(IMGUI)
    file(GLOB IMGUI_FILES "./lib/imgui/*.h" "./lib/imgui/*.cpp" "./lib/imgui/examples/imgui_impl_${glfw ? 'glfw' : 'sdl'}.h" "./lib/imgui/examples/imgui_impl_${glfw ? 'glfw' : 'sdl'}.cpp" "./lib/imgui/examples/imgui_impl_opengl3.h" "./lib/imgui/examples/imgui_impl_opengl3.cpp")` : ''}${sdl ? `
    message(STATUS "Setting up sdl...")
    add_subdirectory(lib/sdl)
    include_directories(lib/sdl/include)
    add_compile_definitions(SDL)` : ''}${stb ? `
message(STATUS "Setting up stb...")
include_directories(lib/stb)` : ''}${glm ? `
    message(STATUS "Setting up glm...")
include_directories(lib/glm/glm)` : ''}${mathfu ? `
    message(STATUS "Setting up MathFu...")
include_directories(lib/mathfu/include)
include_directories(lib/mathfu/dependencies/vectorial/include)` : ''}${freetype ? `
message(STATUS "Setting up freetype...")
add_subdirectory(lib/freetype)
include_directories(lib/freetype/include)` : ''}

if(EXISTS res)
    message(STATUS "Copying resources...")
    file(COPY res DESTINATION \${CMAKE_BINARY_DIR})
endif()

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
file(GLOB_RECURSE SRC_FILES "./src/*.h" "./src/*.cpp")
add_executable(${projectName} \${SRC_FILES}${imgui ? ' ${IMGUI_FILES}' : ''})
${sdl ? `target_compile_options(${projectName} PUBLIC -l SDL2 -lGL)` : ''}
if (UNIX)
    target_compile_options(${projectName} PUBLIC ${imgui && glad ? '-DIMGUI_IMPL_OPENGL_LOADER_GLAD ' : ''}-Wall -Wextra -pedantic${xlib ? ' -lX11 -lGL' : ''})
elseif (WIN32)
    target_compile_options(${projectName} PUBLIC)
    set_target_properties(${projectName} PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE)
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)${xlib ? `
find_package(X11 REQUIRED)` : ''}
target_link_libraries(${projectName} OpenGL::GL)${xlib ? `
target_link_libraries(${projectName} X11)` : ''}${sdl ? `
target_link_libraries(${projectName} SDL2)` : ''}${glfw ? `
target_link_libraries(${projectName} glfw)` : ''}${glew ? `
target_link_libraries(${projectName} glew)` : ''}${glad ? `
target_link_libraries(${projectName} glad \${CMAKE_DL_LIBS})` : ''}${freetype ? `
target_link_libraries(${projectName} freetype)` : ''}
`;
    }

    function getMainString() {
        let file = 'main/xlib.txt';

        if (glfw) {
            file = 'main/glfw.txt';
        }

        if (sdl) {
            file = 'main/sdl.txt';
        }

        let glewInit = `
        std::cout << "Initializing glew...";

    if (glewInit() != GLEW_OK){
        std::cout << "FAILED" << std::endl;
    }

    std::cout << "OK" << std::endl;
    `;

        let xlibGlewImport = `
#include <GL/glew.h>
#include <X11/Xlib.h>
#include <GL/glx.h>`;

        let glewImport = `
#include <GL/glew.h>`;

        let xlibImport = `
#include <X11/Xlib.h>
#include <X11/Xutil.h>

#include <GL/gl.h>
#include <GL/glx.h>`;

        let gladImport = `
        #include <glad/glad.h>`;

        let gladInit = `
        std::cout << "Initializing glad...";

    if (!gladLoadGLLoader((GLADloadproc) ${glfw ? 'glfwGetProcAddress' : 'SDL_GL_GetProcAddress'})) {
        std::cout << "FAILED" << std::endl;
        return -1;
    }

    std::cout << "OK" << std::endl;
    `;

        let glmImport = `
        #include <glm.hpp>`;

        let glmTest = `
        glm::vec2 glmTest = glm::vec2(1.0) + glm::vec2(0);

    if (glmTest == glm::vec2(1.0)) {
        std::cout << "glm present..." << std::endl;
    }
    `;

        let mathfuImport = `
        #include <mathfu/vector.h>`;

        let mathfuTest = `
        mathfu::Vector<unsigned int, 2> mathfuTest = mathfu::Vector<unsigned int, 2>(1) + mathfu::Vector<unsigned int, 2>((unsigned int)0);

    if (mathfuTest == mathfu::Vector<unsigned int, 2>(1)) {
        std::cout << "MathFu present..." << std::endl;
    }
`;

        let stbImport = `
        #define STB_IMAGE_IMPLEMENTATION
        #include <stb_image.h>`;

        let stbTest = `
        int width, height, channels;
    unsigned char * img = stbi_load("res/glub.png", &width, &height, &channels, 0);

    if (img == nullptr) {
        std::cout << "Unable to load image" << std::endl;
        return 1;
    }

    std::cout << "Image loaded, stb_image working..." << std::endl;
    `;

        let imguiImport = `
        #include <imgui.h>
#include <imgui_impl_${glfw ? 'glfw' : 'sdl'}.h>
#include <imgui_impl_opengl3.h>`;

        let imguiInit = `
        std::cout << "Initializing imgui...";
    
        IMGUI_CHECKVERSION();
        ImGui::CreateContext();
        ImGuiIO& io = ImGui::GetIO();
        (void) io;
        ImGui::StyleColorsDark();
        ${glfw ? 'ImGui_ImplGlfw_InitForOpenGL(window, true);' : 'ImGui_ImplSDL2_InitForOpenGL(window, context);'}
        ImGui_ImplOpenGL3_Init("#version 330");
        bool demoWindow = true;
    
        std::cout << "OK" << std::endl;
        `;

        let imguiRender = `
        ImGui_ImplOpenGL3_NewFrame();
        ${glfw ? 'ImGui_ImplGlfw_NewFrame();' : 'ImGui_ImplSDL2_NewFrame(window);'}
        ImGui::NewFrame();
        ImGui::ShowDemoWindow(&demoWindow);
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        `;

        let imguiCleanup = `
        ImGui_ImplOpenGL3_Shutdown();
        ImGui_Impl${glfw ? 'Glfw' : 'SDL2'}_Shutdown();
        ImGui::DestroyContext();
        `;

        let freetypeImport = `
        #include <ft2build.h>
        #include FT_FREETYPE_H`;

        let freetypeInit = `
        std::cout << "Initializing freetype...";

        FT_Library ft;
        if (FT_Init_FreeType(&ft)) {
            std::cout << "FAILED" << std::endl;
        }
    
        std::cout << "OK" << std::endl;
        `;

        return $.get(file).then((data) => {
            let main = data.replace('PROJECT_NAME', projectName);

            if (!glfw) {
                if (glew) {
                    main = main.replace('XLIB_IMPORT', '').replace('XLIB_GLEW_IMPORT', xlibGlewImport);
                } else {
                    main = main.replace('XLIB_IMPORT', xlibImport).replace('XLIB_GLEW_IMPORT', '');
                }
            }

            if (glew) {
                main = main.replace('GLEW_INIT', glewInit).replace('GLEW_IMPORT', glewImport);
            } else {
                main = main.replace('GLEW_INIT', '').replace('GLEW_IMPORT', '');
            }

            if (glad) {
                main = main.replace('GLAD_IMPORT', gladImport).replace('GLAD_INIT', gladInit);
            } else {
                main = main.replace('GLAD_IMPORT', '').replace('GLAD_INIT', '');
            }

            if (glm) {
                main = main.replace('GLM_IMPORT', glmImport).replace('GLM_TEST', glmTest);
            } else {
                main = main.replace('GLM_IMPORT', '').replace('GLM_TEST', '');
            }

            if (mathfu) {
                main = main.replace('MATHFU_IMPORT', mathfuImport).replace('MATHFU_TEST', mathfuTest);
            } else {
                main = main.replace('MATHFU_IMPORT', '').replace('MATHFU_TEST', '');
            }

            if (stb) {
                main = main.replace('STB_IMPORT', stbImport).replace('STB_TEST', stbTest);
            } else {
                main = main.replace('STB_IMPORT', '').replace('STB_TEST', '');
            }

            if (imgui) {
                main = main.replace('IMGUI_IMPORT', imguiImport).replace('IMGUI_INIT', imguiInit).replace('IMGUI_RENDER', imguiRender).replace('IMGUI_CLEANUP', imguiCleanup);
            } else {
                main = main.replace('IMGUI_IMPORT', '').replace('IMGUI_INIT', '').replace('IMGUI_RENDER', '').replace('IMGUI_CLEANUP', '');
            }

            if (freetype) {
                main = main.replace('FREETYPE_IMPORT', freetypeImport).replace('FREETYPE_INIT', freetypeInit);
            } else {
                main = main.replace('FREETYPE_IMPORT', '').replace('FREETYPE_INIT', '');
            }

            return main;
        });
    }
})