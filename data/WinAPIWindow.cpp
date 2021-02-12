#include <windows.h>
#include <GL\gl.h>

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
bool active = true;

class WindowClass {
public:
	WindowClass() {
		hInstance = GetModuleHandle(NULL);
		wc.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
		wc.lpfnWndProc = (WNDPROC)WndProc;
		wc.cbClsExtra = 0;
		wc.cbWndExtra = 0;
		wc.hInstance = hInstance;
		wc.hIcon = LoadIcon(NULL, IDI_WINLOGO);
		wc.hCursor = LoadCursor(NULL, IDC_ARROW);
		wc.hbrBackground = NULL;
		wc.lpszMenuName = NULL;
		wc.lpszClassName = "glub";
	}

	~WindowClass() {
		destroyWindow();
	}

	bool create(unsigned int width, unsigned int height, const char* title) {
		GLuint PixelFormat;
		DWORD dwExStyle;
		DWORD dwStyle;
		RECT WindowRect;
		WindowRect.left = (long)0;
		WindowRect.right = (long)width;
		WindowRect.top = (long)0;
		WindowRect.bottom = (long)height;

		if (!RegisterClass(&wc)) {
			return false;
		}

		dwExStyle = WS_EX_APPWINDOW | WS_EX_WINDOWEDGE;
		dwStyle = WS_OVERLAPPEDWINDOW;

		AdjustWindowRectEx(&WindowRect, dwStyle, false, dwExStyle);

		if (!(hWnd = CreateWindowEx(dwExStyle, "glub", title, dwStyle | WS_CLIPSIBLINGS | WS_CLIPCHILDREN, 0, 0, WindowRect.right - WindowRect.left, WindowRect.bottom - WindowRect.top, NULL, NULL, hInstance, NULL))) {
			destroyWindow();
			return false;
		}

		static  PIXELFORMATDESCRIPTOR pfd = {
				sizeof(PIXELFORMATDESCRIPTOR), 1, PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER, PFD_TYPE_RGBA, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, PFD_MAIN_PLANE, 0, 0, 0, 0
		};

		if (!(hDC = GetDC(hWnd))) {
			destroyWindow();
			return false;
		}

		if (!(PixelFormat = ChoosePixelFormat(hDC, &pfd))) {
			destroyWindow();
			return false;
		}

		if (!SetPixelFormat(hDC, PixelFormat, &pfd)) {
			destroyWindow();
			return false;
		}

		if (!(hRC = wglCreateContext(hDC))) {
			destroyWindow();
			return false;
		}

		if (!wglMakeCurrent(hDC, hRC)) {
			destroyWindow();
			return false;
		}

		ShowWindow(hWnd, SW_SHOW);
		SetForegroundWindow(hWnd);
		SetFocus(hWnd);
		glViewport(0, 0, width, height);

		glShadeModel(GL_SMOOTH);
		glClearColor(0.0f, 0.0f, 0.0f, 0.5f);
		glClearDepth(1.0f);
		glEnable(GL_DEPTH_TEST);
		glDepthFunc(GL_LEQUAL);
		glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);

		return true;
	}

	void start(std::function<void()> onUpdate) {
		MSG msg;
		bool done = false;

		while (!done) {
			if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
				if (msg.message == WM_QUIT) {
					done = TRUE;
				} else {
					TranslateMessage(&msg);
					DispatchMessage(&msg);
				}
			} else {
				if (active) {
					glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
					SwapBuffers(hDC);
                    onUpdate();
				}
			}
		}
	}

	void destroyWindow() {
		if (hRC) {
			wglMakeCurrent(NULL, NULL);
			wglDeleteContext(hRC);
			hRC = NULL;
		}

		if (hDC && !ReleaseDC(hWnd, hDC)) {
			hDC = NULL;
		}

		if (hWnd && !DestroyWindow(hWnd)) {
			hWnd = NULL;
		}

		if (!UnregisterClass("glub", hInstance)) {
			hInstance = NULL;
		}
	}

private:
	HDC hDC = NULL;
	HGLRC hRC = NULL;
	HWND hWnd = NULL;
	HINSTANCE hInstance;
	WNDCLASS wc;
};

LRESULT CALLBACK WndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
	switch (uMsg) {
		case WM_ACTIVATE:
			active = !HIWORD(wParam);
			return 0;

		case WM_SYSCOMMAND:
			switch (wParam) {
				case SC_SCREENSAVE:
				case SC_MONITORPOWER:
					return 0;
			}

			break;

		case WM_CLOSE:
			PostQuitMessage(0);
			return 0;

		case WM_SIZE:
			glViewport(0, 0, LOWORD(lParam), HIWORD(lParam));
			return 0;
	}

	return DefWindowProc(hWnd, uMsg, wParam, lParam);
}

int main();

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
	return main();
}
