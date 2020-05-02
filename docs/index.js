$(document).ready(() => {
    let projectName = "OpenGL-Boilerplate";
    let projectVersion = "1.0.0";
    let projectDescription = "Simple CMake setup for developing OpenGL programs in C++";
    let glew = false, glad = false, glfw = false, stbImg = false, imgui = false, sdl = false, glm = false;

    updateResult();

    $('#result').on('click', () => {
        let $temp = $("<textarea style='opacity: 0'>");
        $("body").append($temp);

        if ($('#cmakelists').hasClass('selected')) {
            $temp.val(getCmakeString()).select();
            document.execCommand("copy");
            $temp.remove();
        } else {
            getMainString().then((data) => {
                $temp.val(data.toString()).select();
                document.execCommand("copy");
                $temp.remove();
            });
        }
    });

    $('#cmakelists').on('click', () => {
        $('#cmakelists').addClass('selected');
        $('#main').removeClass('selected');
        updateResult();
    });

    $('#main').on('click', () => {
        $('#main').addClass('selected');
        $('#cmakelists').removeClass('selected');
        updateResult();
    });

    $('#glew').on('click', () => {
        glew = !glew;
        $('#glew').toggleClass('selected');
        updateResult();
    });

    $('#glad').on('click', () => {
        glad = !glad;
        $('#glad').toggleClass('selected');
        glfw = true;
        $('#glfw').addClass('selected');        // glad requires glad/gl.h and glad/glx.h to be generated in order to work directly with xlib
        updateResult();
    });

    $('#glfw').on('click', () => {
        glfw = !glfw;
        $('#glfw').toggleClass('selected');

        if (!glfw) {
            $('#glad').removeClass('selected');
            glad = false;
        }

        updateResult();
    });

    $('#stb-img').on('click', () => {
        stbImg = !stbImg;
        $('#stb-img').toggleClass('selected');
        updateResult();
    });

    $('#imgui').on('click', () => {
        imgui = !imgui;
        $('#imgui').toggleClass('selected');
        updateResult();
    });

    $('#sdl').on('click', () => {
        sdl = !sdl;
        $('#sdl').toggleClass('selected');
        updateResult();
    });

    $('#glm').on('click', () => {
        glm = !glm;
        $('#glm').toggleClass('selected');
        updateResult();
    });

    $('#project-name').on('input', () => {
        projectName = $('#project-name').val();
        projectName = projectName.replace(' ', '-');
        $('#project-name').val(projectName);

        if (!projectName) {
            projectName = "OpenGL-Boilerplate";
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
            projectDescription = "Simple CMake setup for developing OpenGL programs in C++";
        }

        updateResult();
    });

    function updateResult() {
        if ($('#cmakelists').hasClass('selected')) {
            $('#result').html(`
            <div>cmake_minimum_required(<span class="blue">VERSION 3.15</span>)</div>
            <br>
            <div>project(<span class="green">${projectName}</span> <span class="blue">VERSION</span> <span class="green">${projectVersion}</span> <span class="blue">DESCRIPTION</span> <span class="green">"${projectDescription}"</span> <span class="blue">LANGUAGES</span> <span class="green">CXX</span>)</div>
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
            <div>file(<span class="blue">GLOB</span> <span class="yellow">IMGUI_FILES</span> <span class="green">"./lib/imgui/*.h" "./lib/imgui/*.cpp" "./lib/imgui/examples/imgui_impl_glfw.h" "./lib/imgui/examples/imgui_impl_glfw.cpp" "./lib/imgui/examples/imgui_impl_opengl3.h" "./lib/imgui/examples/imgui_impl_opengl3.cpp"</span>)</div>
            <br>`
                : ''}
            ${sdl ?
                `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up SDL..."</span>)</div>
            <div>add_subdirectory(<span class="green">lib/sdl</span>)</div>
            <div>add_compile_definitions(<span class="green">SDL</span>)</div>
            <div>include_directories(<span class="green"/>lib/sdl/include</span>)</div>
            <br>`
                : ''}
            ${stbImg ?
                `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up stb image..."</span>)</div>
            <div>add_compile_definitions(<span class="green">STB_IMAGE STB_IMAGE_IMPLEMENTATION</span>)</div>
            <div>include_directories(<span class="green"/>lib/stb</span>)</div>
            <br>`
                : ''}
            ${glm ?
                `<div>messsage(<span class="blue">STATUS</span> <span class="green">"Setting up glm..."</span>)</div>
            <div>add_compile_definitions(<span class="green">GLM</span>)</div>
            <div>include_directories(<span class="green"/>lib/glm/glm</span>)</div>
            <br>`
                : ''}
            <div>message(<span class="blue">STATUS</span> <span class="green">"Copying resources..."</span>)</div>
            <div>file(<span class="blue">COPY</span> <span class="green">res</span> <span class="blue">DESTINATION</span> <span class="yellow">\${CMAKE_BINARY_DIR}</span>)</div>
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
            <div style="margin-left: 20px">target_compile_options(<span class="green">${projectName}</span> <span class="blue">PUBLIC</span> <span class="green">-Wall -Wextra -pedantic${glfw ? '' : ' -lX11 -lGL'}</span>)</div>
            <div><span class="yellow">elseif</span>(<span class="blue">WIN32</span>)</div>
            <div style="margin-left: 20px">target_compile_options(<span class="green">${projectName}</span> <span class="blue">PUBLIC</span>)</div>
            <div style="margin-left: 20px">set_target_properties(<span class="green">${projectName}</span> <span class="blue">PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE</span>)</div>
            <div><span class="yellow">else</span>()</div>
            <div style="margin-left: 20px">message(<span class="blue">FATAL_ERROR</span> <span class="green">"Detected platform is not supported!"</span>)</div>
            <div><span class="yellow">endif</span>()</div>
            <br>
            <div>message(<span class="blue">STATUS</span> <span class="green">"Linking..."</span>)</div>
            <div>find_package(<span class="green">OpenGL</span> <span class="blue">REQUIRED</span>)</div>
            ${glfw ? '' : `
            <div>find_package(<span class="green">X11</span> <span class="blue">REQUIRED</span>)</div>`}
            <div>target_link_libraries(<span class="green">${projectName} OpenGL</span>)</div>
            ${glad ?
                `<div>target_link_libraries(<span class="green">${projectName} glad</span>)</div>` : ''}
            ${glew ?
                `<div>target_link_libraries(<span class="green">${projectName} glew</span>)</div>` : ''}
            ${glfw ?
                `<div>target_link_libraries(<span class="green">${projectName} glfw</span>)</div>` : `
                <div>target_link_libraries(<span class="green">${projectName} X11</span>)</div>`}
            ${sdl ?
                `<div>target_link_libraries(<span class="green">${projectName} SDL2</span>)</div>` : ''}
`);
        } else {
            $('#result').html(`Click to copy main.cpp to clipboard`);
        }
    }

    function getCmakeString() {
        return `cmake_minimum_required(VERSION 3.15)

project(${projectName} VERSION ${projectVersion} DESCRIPTION "${projectDescription}" LANGUAGES CXX)
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
    file(GLOB IMGUI_FILES "./lib/imgui/*.h" "./lib/imgui/*.cpp" "./lib/imgui/examples/imgui_impl_glfw.h" "./lib/imgui/examples/imgui_impl_glfw.cpp" "./lib/imgui/examples/imgui_impl_opengl3.h" "./lib/imgui/examples/imgui_impl_opengl3.cpp")` : ''}${sdl ? `
    message(STATUS "Setting up sdl...")
    add_subdirectory(lib/sdl)
    include_directories(lib/sdl/include)
    add_compile_definitions(SDL)` : ''}${glm ? `
    message(STATUS "Setting up glm...")
include_directories(lib/glm/glm)` : ''}${stbImg ? `
message(STATUS "Setting up stb...")
add_compile_definitions(STB_IMAGE_IMPLEMENTATION)
include_directories(lib/stb)` : ''}
message(STATUS "Copying resources...")
file(COPY res DESTINATION \${CMAKE_BINARY_DIR})

message(STATUS "Setting up build options...")
set(CMAKE_CXX_STANDARD 17)
file(GLOB_RECURSE SRC_FILES "./src/*.h" "./src/*.cpp")
add_executable(${projectName} \${SRC_FILES}${imgui ? ' ${IMGUI_FILES}' : ''})
${sdl ? `target_compile_options(${projectName} PUBLIC -l SDL2 -lGL)` : ''}
if (UNIX)
    target_compile_options(${projectName} PUBLIC -Wall -Wextra -pedantic${glfw ? '' : ' -lX11 -lGL'})
elseif (WIN32)
    target_compile_options(${projectName} PUBLIC)
    set_target_properties(${projectName} PROPERTIES COMPILE_DEFINITIONS BUILDER_STATIC_DEFINE)
else ()
    message(FATAL_ERROR "Detected platform is not supported!")
endif()

message(STATUS "Linking...")
find_package(OpenGL REQUIRED)${glfw ? '' : `
find_package(X11 REQUIRED)`}
target_link_libraries(${projectName} OpenGL::GL)${sdl ? `
target_link_libraries(${projectName} SDL2)` : ''}${glfw ? `
target_link_libraries(${projectName} glfw)` : `
target_link_libraries(${projectName} X11)`}${glew ? `
target_link_libraries(${projectName} glew)` : ''}${glad ? `
target_link_libraries(${projectName} glad)` : ''}
`;
    }

    function getMainString() {
        let file = 'main/xlib.txt';

        if (glfw) {
            file = 'main/glfw.txt';
        }

        if (glad) {
            file = 'main/glfw-glad.txt';
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

        return $.get(file).then((data) => {
            let main = data.replace('PROJECT_NAME', projectName);

            if (glew) {
                main = main.replace('GLEW_INIT', glewInit).replace('XLIB_GLEW_IMPORT', xlibGlewImport).replace('GLEW_IMPORT', glewImport).replace('XLIB_IMPORT', '');
            } else {
                main = main.replace('GLEW_INIT', '').replace('XLIB_GLEW_IMPORT', '').replace('GLEW_IMPORT', '').replace('XLIB_IMPORT', xlibImport);
            }

            return main;
        });
    }
})