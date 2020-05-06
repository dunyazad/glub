#include <iostream>

#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm.hpp>
#define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>

int main() {
    GLFWwindow * window;

    std::cout << "Initializing glfw...";

    if (!glfwInit()) {
        std::cout << "FAILED" << std::endl;
        return -1;
    }

    std::cout << "OK" << std::endl << "Creating window...";

    window = glfwCreateWindow(640, 480, "glub", nullptr, nullptr);

    if (!window) {
        std::cout << "FAILED" << std::endl;
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);

    std::cout << "OK" << std::endl;

    std::cout << "Initializing glew...";

    if (glewInit() != GLEW_OK){
        std::cout << "FAILED" << std::endl;
    }

    std::cout << "OK" << std::endl;

    glm::vec2 glmTest = glm::vec2(1.0) + glm::vec2(0);

    if (glmTest == glm::vec2(1.0)) {
        std::cout << "glm present..." << std::endl;
    }

    int width, height, channels;
    unsigned char * img = stbi_load("res/glub.png", &width, &height, &channels, 0);

    if (img == nullptr) {
        std::cout << "Unable to load image" << std::endl;
        return 1;
    }

    std::cout << "Image loaded, stb_image working..." << std::endl;

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        glClearColor(0.2f, 0.2f, 0.2f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        int display_w, display_h;
        glfwGetFramebufferSize(window, &display_w, &display_h);
        glViewport(0, 0, display_w, display_h);
        glfwSwapBuffers(window);
    }

    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}
