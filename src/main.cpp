#include <iostream>

#include "imgui.h"
#include "imgui_impl_opengl3.h"

#ifdef GLEW
    #include <GL/glew.h>
#endif

#ifdef GLAD
    #include <glad/glad.h>
#endif

#ifdef GLFW
    #include "imgui_impl_glfw.h"
    #include <GLFW/glfw3.h>
#endif

#ifdef SDL
    #include <SDL2/SDL.h>
#endif

#include <glm.hpp>
#include <stb_image.h>

int main() {
    #ifdef GLFW
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
    #endif

    #ifdef SDL
        SDL_Window * window = SDL_CreateWindow("OpenGL Boilerplate", 0, 0, 640, 480, SDL_WINDOW_OPENGL);

        if (!window) {
            std::cout << "Unable to create a window!" << std::endl;
            return -1;
        }

        SDL_GL_CreateContext(window);

        std::cout << "Window created, sdl initialized..." << std::endl;
    #endif

    #ifdef GLAD
        if (!gladLoadGLLoader((GLADloadproc) glfwGetProcAddress)) {
            std::cout << "Unable to initialize glad!" << std::endl;
            return -1;
        }

        std::cout << "glad initialized..." << std::endl;
    #endif

    #ifdef GLEW
        if (glewInit() != GLEW_OK) {
            std::cout << "Unable to initialize glew!" << std::endl;
            return -1;
        }

        std::cout << "glew initialized..." << std::endl;
    #endif

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

    #ifdef SDL
        bool running = true;

        while (running) {
            SDL_Event Event;

            while (SDL_PollEvent(&Event)) {
                if (Event.type == SDL_KEYDOWN) {
                    switch (Event.key.keysym.sym) {
                        case SDLK_ESCAPE:
                            running = false;
                            break;
                        default:
                            break;
                    }
                } else if (Event.type == SDL_QUIT) {
                    running = false;
                }
            }

            glViewport(0, 0, 640, 480);
            glClearColor(0.2, 0.2, 0.2, 0.2);
            glClear(GL_COLOR_BUFFER_BIT);

            SDL_GL_SwapWindow(window);
        }
    #endif

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    (void) io;
    ImGui::StyleColorsDark();
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 330");
    bool demoWindow = true;

    #ifdef GLFW
        while (!glfwWindowShouldClose(window)) {
            glfwPollEvents();

            ImGui_ImplOpenGL3_NewFrame();
            ImGui_ImplGlfw_NewFrame();
            ImGui::NewFrame();
            ImGui::ShowDemoWindow(&demoWindow);
            ImGui::Render();

            int display_w, display_h;
            glfwGetFramebufferSize(window, &display_w, &display_h);
            glViewport(0, 0, display_w, display_h);
            glClearColor(0.2, 0.2, 0.2, 1);
            glClear(GL_COLOR_BUFFER_BIT);
            ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

            glfwSwapBuffers(window);
        }

        ImGui_ImplOpenGL3_Shutdown();
        ImGui_ImplGlfw_Shutdown();
        ImGui::DestroyContext();

        glfwDestroyWindow(window);
        glfwTerminate();
    #endif

    return 0;
}