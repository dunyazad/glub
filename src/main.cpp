#include <iostream>

#include <GL/glew.h>
#include <GLFW/glfw3.h>

int main() {
    GLFWwindow * window;

    if (!glfwInit()) {
        std::cout << "Unable to initialize glfw!" << std::endl;
        return -1;
    }

    std::cout << "glfw initialized..." << std::endl;

    window = glfwCreateWindow(640, 480, "OpenGL Boilerplate", NULL, NULL);

    if (!window) {
        std::cout << "Unable to create a window!" << std::endl;
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);

    std::cout << "Window created..." << std::endl;

    if (glewInit() != GLEW_OK) {
        std::cout << "Unable to initialize glew!" << std::endl;
        return -1;
    }

    std::cout << "glew initialized..." << std::endl;

    while (!glfwWindowShouldClose(window)) {
        glClear(GL_COLOR_BUFFER_BIT);
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();

    return 0;
}