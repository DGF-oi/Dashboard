import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronRight, FilePlus2, Search, UserRound, Home, MessageSquare } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { appEnv } from "@/app/config/env";
import { setCompactSidebar, setLanguage, setTheme } from "@/app/store/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

const isPathActive = (pathname: string, targetPath: string, exact = false) => {
  return exact ? pathname === targetPath : pathname.startsWith(targetPath);
};

const getNavItemClassName = (baseClassName: string, isActive: boolean) => {
  return `btn ${baseClassName} ${isActive ? `${baseClassName}--active` : ""}`.trim();
};

export const AppShellLayout = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const auth = useAppSelector((state) => state.auth ?? null);
  const location = useLocation();
  const isRequestSectionActive = isPathActive(location.pathname, "/request");
  const isAuthenticated = Boolean(auth?.token);
  const userName = auth?.profile?.name ?? t("common:header.guest");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRequestTreeOpen, setIsRequestTreeOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isRequestSectionActive) {
      setIsRequestTreeOpen(true);
    }
  }, [isRequestSectionActive]);

  const notifications = useMemo(() => {
    const messages = {
      ja: [
        { id: "notice-1", title: "notice-1", time: "5m" },
        { id: "notice-2", title: "notice-2", time: "18m" },
      ],
      en: [
        { id: "notice-1", title: "Request req-002 is waiting for review", time: "5m ago" },
        { id: "notice-2", title: "OCR pipeline dry run has completed", time: "18m ago" },
      ],
    };

    return messages[settings.language] ?? messages.ja;
  }, [settings.language]);

  const closeAllPanels = () => {
    setIsNotificationOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target instanceof Node ? event.target : null;

      if (
        isNotificationOpen &&
        notificationMenuRef.current &&
        targetNode &&
        !notificationMenuRef.current.contains(targetNode)
      ) {
        setIsNotificationOpen(false);
      }

      if (isUserMenuOpen && userMenuRef.current && targetNode && !userMenuRef.current.contains(targetNode)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isNotificationOpen, isUserMenuOpen]);

  const formattedDateTime = currentDateTime.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className={`app-shell ${settings.ui.compactSidebar ? "app-shell--sidebar-compact" : ""} ${isMobileSidebarOpen ? "app-shell--sidebar-open" : ""}`}>
      <aside className="app-shell__sidebar border-end p-4">
        <div className="app-shell__brand">
          <NavLink className="app-shell__brand-mark" to="/" aria-label="dashss Home">
            <span className="app-shell__brand-mark-full">dashss</span>
            <span className="app-shell__brand-mark-compact">d</span>
          </NavLink>
          <div className="app-shell__brand-copy">
            <p className="eyebrow mb-2">Frontend Architecture</p>
            <h1 className="h4 mb-2">dashss</h1>
            <p className="app-shell__subtitle small mb-0">{appEnv.appName}</p>
          </div>
        </div>
        <nav className="app-nav mt-4 d-grid gap-2">
          <div className="app-nav__tree">
            <button
              type="button"
              className={getNavItemClassName("app-nav__tree-toggle", isRequestSectionActive)}
              aria-expanded={isRequestTreeOpen}
              onClick={() => setIsRequestTreeOpen((current) => !current)}
            >
              <span className="app-nav__icon" aria-hidden="true">
                <span className="app-nav__icon-mark">
                  <FilePlus2 size={16} />
                </span>
              </span>
              <span className="app-nav__label">{t("common:navigation.requests")}</span>
              <span className="app-nav__chevron" aria-hidden="true">
                {isRequestTreeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            </button>
            {isRequestTreeOpen ? (
              <div className="app-nav__tree-children">
                <NavLink
                  className={({ isActive }) => getNavItemClassName("app-nav__tree-link", isActive)}
                  to="/request/new"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="app-nav__icon" aria-hidden="true">
                    <span className="app-nav__icon-mark">
                      <FilePlus2 size={14} />
                    </span>
                  </span>
                  <span className="app-nav__label">{t("common:navigation.createRequest")}</span>
                </NavLink>
                <NavLink
                  end
                  className={({ isActive }) => getNavItemClassName("app-nav__tree-link", isActive)}
                  to="/request"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="app-nav__icon" aria-hidden="true">
                    <span className="app-nav__icon-mark">
                      <Search size={14} />
                    </span>
                  </span>
                  <span className="app-nav__label">{t("common:navigation.search")}</span>
                </NavLink>
              </div>
            ) : null}
          </div>
          <NavLink
            className={({ isActive }) => getNavItemClassName("app-nav__account-link", isActive)}
            to="/auth/login"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <span className="app-nav__icon" aria-hidden="true">
              <UserRound size={16} />
            </span>
            <span className="app-nav__label">{isAuthenticated ? t("common:navigation.account") : t("common:navigation.login")}</span>
          </NavLink>
        </nav>
      </aside>
      <main className="app-shell__content">
        <header className="toolbar border-bottom px-3 px-lg-4 py-1 py-lg-2">
          <div className="toolbar__group">
            <div className="toolbar__section toolbar__section--left">
              <button
                className="btn btn-link toolbar__icon-button toolbar__icon-button--menu"
                aria-label={t("common:header.menu")}
                onClick={() => {
                  if (window.innerWidth < 960) {
                    setIsMobileSidebarOpen((current) => !current);
                  } else {
                    dispatch(setCompactSidebar(!settings.ui.compactSidebar));
                  }
                }}
              >
                <i className="bi bi-list fs-5" aria-hidden="true" />
              </button>
              <nav className="toolbar__nav-links d-flex align-items-center ms-2 gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) => `toolbar__nav-link d-flex align-items-center text-decoration-none text-dark${isActive ? ' active' : ''}`}
                  style={{ fontWeight: 500 }}
                >
                  <Home size={18} className="me-1" />
                  <span>Home</span>
                </NavLink>
                <NavLink
                  to="/qa"
                  className={({ isActive }) => `toolbar__nav-link d-flex align-items-center text-decoration-none text-dark${isActive ? ' active' : ''}`}
                  style={{ fontWeight: 500 }}
                >
                  <MessageSquare size={18} className="me-1" />
                  <span>Q&amp;A</span>
                </NavLink>
              </nav>
            </div>
            <div className="toolbar__section toolbar__section--center" />
            <div className="toolbar__section toolbar__section--right">
              <div className="toolbar__menu-wrap" ref={notificationMenuRef}>
                <button
                  className="btn btn-outline-secondary toolbar__icon-button"
                  aria-label={t("common:header.notifications")}
                  onClick={() => {
                    setIsNotificationOpen((current) => !current);
                    setIsUserMenuOpen(false);
                  }}
                >
                  <Bell size={18} />
                  {notifications.length > 0 ? <span className="toolbar__badge">{notifications.length}</span> : null}
                </button>
                {isNotificationOpen ? (
                  <div className="toolbar__panel toolbar__panel--notifications">
                    <div className="toolbar__panel-header">
                      <strong>{t("common:header.notifications")}</strong>
                      <span>{settings.language.toUpperCase()}</span>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="toolbar__notification-list">
                        {notifications.map((notification) => (
                          <article className="toolbar__notification-item" key={notification.id}>
                            <strong>{notification.title}</strong>
                            <span>{notification.time}</span>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p>{t("common:header.noNotifications")}</p>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="toolbar__menu-wrap" ref={userMenuRef}>
                <button
                  className="btn btn-outline-secondary toolbar__icon-button toolbar__profile-button"
                  aria-label={t("common:header.userMenu")}
                  onClick={() => {
                    setIsUserMenuOpen((current) => !current);
                    setIsNotificationOpen(false);
                  }}
                >
                  <UserRound size={18} />
                  <span className="toolbar__profile-name">{userName}</span>
                </button>
                {isUserMenuOpen ? (
                  <div className="toolbar__panel">
                    <div className="toolbar__panel-header">
                      <strong>{userName}</strong>
                      <span>{isAuthenticated ? auth?.profile?.id : t("common:header.guest")}</span>
                    </div>
                    <div className="toolbar__panel-section">
                      <span>{t("common:header.viewProfile")}</span>
                    </div>
                    <div className="toolbar__panel-section">
                      <span>Now</span>
                      <strong>{formattedDateTime}</strong>
                    </div>
                    <label className="toolbar__field">
                      <span>{t("common:settings.currentLanguage")}</span>
                      <select
                        className="form-select form-select-sm"
                        value={settings.language}
                        onChange={(event) => dispatch(setLanguage(event.target.value as "ja" | "en"))}
                      >
                        <option value="ja">JA</option>
                        <option value="en">EN</option>
                      </select>
                    </label>
                    <label className="toolbar__field">
                      <span>{t("common:settings.theme")}</span>
                      <select
                        className="form-select form-select-sm"
                        value={settings.theme}
                        onChange={(event) => dispatch(setTheme(event.target.value as "light" | "dark" | "system"))}
                      >
                        <option value="light">{t("common:themeOptions.light")}</option>
                        <option value="dark">{t("common:themeOptions.dark")}</option>
                        <option value="system">{t("common:themeOptions.system")}</option>
                      </select>
                    </label>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
        {isMobileSidebarOpen ? (
          <button
            aria-label="close-panel"
            className="app-shell__scrim"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              closeAllPanels();
            }}
          />
        ) : null}
        <div className="app-shell__body p-3 p-lg-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


