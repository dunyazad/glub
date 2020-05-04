![glub](./docs/img/glub.svg)

# openGL's Ultimate Boilerplate
Easy to use CMake boilerplate for developing OpenGL programs in C++

## Features

- [OpenGL](https://www.khronos.org/opengl/wiki/Getting_Started)
- [Xlib](https://www.x.org/releases/X11R7.7/doc/libX11/libX11/libX11.html)
- [GLEW](http://glew.sourceforge.net/)
- [GLAD](https://github.com/Dav1dde/glad)
- [GLFW](https://www.glfw.org/)
- [IMGUI](https://github.com/ocornut/imgui)
- [SDL](https://www.libsdl.org/)
- [GLM](https://glm.g-truc.net/0.9.9/index.html)
- [STB Image](https://github.com/nothings/stb/blob/master/stb_image.h)

## Supported platforms

- Linux

# Setup
[Generate custom](./docs/index.html) `CMakeLists.txt` and `main.cpp`

## Bash
1. `mkdir build build/debug build/release`
2. `cd build/debug`
3. `cmake -DCMAKE_BUILD_TYPE=Debug ../../`
4. `cd ../release`
5. `cmake -DCMAKE_BUILD_TYPE=Release ../../`

To build project navigate to `build/debug` or `build/release` and run `cmake --build .`

## CLion
1. File > Settings
2. Build, Execution, Deployment > CMake
3. Create profile for Debug (Generation path: build/debug) and Release (Generation path: build/release)
4. Run
