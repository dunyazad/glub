class Window {
public:
    Window() {
        glfwInit();
    }

    ~Window() {
        destroyWindow();
        glfwTerminate();
    }

    bool create(unsigned int width, unsigned int height, const char * title) {
        destroyWindow();
        window = glfwCreateWindow(width, height, title, nullptr, nullptr);

        if (!window) {
            return false;
        }

        glfwMakeContextCurrent(window);

        return true;
    }

    void start(std::function<void()> onUpdate) {
        while (!glfwWindowShouldClose(window)) {
            glfwPollEvents();
            glClearColor(0.2f, 0.2f, 0.2f, 1.0f);
            glClear(GL_COLOR_BUFFER_BIT);

            onUpdate();

            int display_w, display_h;
            glfwGetFramebufferSize(window, &display_w, &display_h);
            glViewport(0, 0, display_w, display_h);
            glfwSwapBuffers(window);
        }
    }

    void destroyWindow() {
        if (window) {
            glfwDestroyWindow(window);
            window = nullptr;
        }
    }

private:
    GLFWwindow * window = nullptr;
};
