#include <iostream>

#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm.hpp>
#include <stb_image.h>

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

    glm::vec2 glmTest = glm::vec2(1.0) + glm::vec2(0);

    if (glmTest == glm::vec2(1.0)) {
        std::cout << "glm present..." << std::endl;
    }

    int width, height, channels;
    unsigned char * img = stbi_load("res/OpenGL.png", &width, &height, &channels, 0);

    if (img == nullptr) {
        std::cout << "Unable to load image" << std::endl;
        return 1;
    }

    std::cout << "Image loaded, stb_image working..." << std::endl;

    while (!glfwWindowShouldClose(window)) {
        glClear(GL_COLOR_BUFFER_BIT);
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();

    return 0;
}