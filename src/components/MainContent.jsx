import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import { ArrowLeft, Hand, HandGrab } from "lucide-react";

const MainContent = forwardRef(
  (
    {
      accentColor,
      mainBgColor,
      menuThemeColor,
      textColor,
      isDarkTheme,
      onOpenMenu,
      onCloseMenu,
      menuRef,
      onZoomChange,
    },
    ref
  ) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [activeSection, setActiveSection] = useState("home");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isZoomedOut, setIsZoomedOut] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Hint overlay to teach drag when user scrolls
    const [showDragHint, setShowDragHint] = useState(false);

    // Track screen width to decide simple scroll fallback
    const [screenWidth, setScreenWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 1200
    );

    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());
    const snapTimeoutRef = useRef(null);
    const zoomAnimationRef = useRef(null);
    const dragThresholdRef = useRef(false);
    const dragHintTimeoutRef = useRef(null);

    // Touch pinch tracking
    const pinchRef = useRef({
      active: false,
      startDistance: 0,
      hasTriggered: false,
      centerX: 0,
      centerY: 0,
    });

    // refs for latest position/velocity so RAF loops read fresh values
    const positionRef = useRef(position);
    const velocityRef = useRef(velocity);

    const PANEL_WIDTH = useMemo(
      () => (typeof window !== "undefined" ? window.innerWidth : 1920),
      []
    );
    const PANEL_HEIGHT = useMemo(
      () => (typeof window !== "undefined" ? window.innerHeight : 1080),
      []
    );
    const EDGE_RESISTANCE = 0.15;
    const FRICTION = 0.88;
    const VELOCITY_THRESHOLD = 0.25;
    const SNAP_THRESHOLD = 0.3;
    const MAX_ZOOM = 1;
    const MENU_ZOOM = 0.38;
    const DRAG_THRESHOLD = 5;
    const MENU_WIDTH = 384; // w-96 = 24rem = 384px

    // keep refs in sync with state
    useEffect(() => {
      positionRef.current = position;
    }, [position]);
    useEffect(() => {
      velocityRef.current = velocity;
    }, [velocity]);

    useEffect(() => {
      setIsTouchDevice("ontouchstart" in window);
      const onResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    // Decide whether to use the simple scroll layout:
    const isSimpleScroll = isTouchDevice || screenWidth <= 1024;

    const panelLayout = useMemo(
      () => ({
        home: {
          gridX: 0,
          gridY: 0,
          component: Hero,
          title: "Home",
        },
        about: {
          gridX: 1,
          gridY: 0,
          component: About,
          title: "About",
        },
        contact: {
          gridX: 0,
          gridY: 1,
          component: Contact,
          title: "Contact",
        },
        projects: {
          gridX: 1,
          gridY: 1,
          component: Projects,
          title: "Projects",
        },
      }),
      []
    );

    const gridToPixels = useCallback(
      (gridX, gridY) => ({ x: gridX * PANEL_WIDTH, y: gridY * PANEL_HEIGHT }),
      [PANEL_WIDTH, PANEL_HEIGHT]
    );

    // Calculate the centered menu zoom position
    const getMenuZoomPosition = useCallback(() => {
      const availableWidth = window.innerWidth - MENU_WIDTH;
      const centerX = availableWidth / 2;
      const centerY = window.innerHeight / 2;

      // The junction point in world coordinates is at (PANEL_WIDTH, PANEL_HEIGHT)
      const junctionX = PANEL_WIDTH;
      const junctionY = PANEL_HEIGHT;

      // Position so junction appears at center of available space
      return {
        x: centerX - junctionX * MENU_ZOOM,
        y: centerY - junctionY * MENU_ZOOM,
      };
    }, [PANEL_WIDTH, PANEL_HEIGHT, MENU_WIDTH, MENU_ZOOM]);

    const applyEdgeResistance = useCallback(
      (newPos) => {
        const maxX = 0;
        const minX = -PANEL_WIDTH;
        const maxY = 0;
        const minY = -PANEL_HEIGHT;

        let resistedX = newPos.x;
        let resistedY = newPos.y;

        if (resistedX > maxX) {
          resistedX = maxX + (resistedX - maxX) * EDGE_RESISTANCE;
        } else if (resistedX < minX) {
          resistedX = minX - (minX - resistedX) * EDGE_RESISTANCE;
        }

        if (resistedY > maxY) {
          resistedY = maxY + (resistedY - maxY) * EDGE_RESISTANCE;
        } else if (resistedY < minY) {
          resistedY = minY - (minY - resistedY) * EDGE_RESISTANCE;
        }

        return { x: resistedX, y: resistedY };
      },
      [PANEL_WIDTH, PANEL_HEIGHT]
    );

    const snapToNearestPanel = useCallback(() => {
      const currentX = -positionRef.current.x;
      const currentY = -positionRef.current.y;

      let closestPanel = "home";
      let minDistance = Infinity;
      let targetPos = { x: 0, y: 0 };

      Object.entries(panelLayout).forEach(([key, panel]) => {
        const panelPos = gridToPixels(panel.gridX, panel.gridY);
        const distance = Math.hypot(
          currentX - panelPos.x,
          currentY - panelPos.y
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestPanel = key;
          targetPos = panelPos;
        }
      });

      const distanceRatio = minDistance / Math.max(PANEL_WIDTH, PANEL_HEIGHT);
      const duration = 300;
      const startPos = { ...positionRef.current };
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setPosition({
          x: startPos.x + (-targetPos.x - startPos.x) * eased,
          y: startPos.y + (-targetPos.y - startPos.y) * eased,
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setVelocity({ x: 0, y: 0 });
          setActiveSection(closestPanel);
          try {
            window.history.replaceState(null, null, `#${closestPanel}`);
          } catch (err) {
            /* ignore */
          }
        }
      };

      if (distanceRatio < SNAP_THRESHOLD) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animate();
      } else {
        setActiveSection(closestPanel);
        try {
          window.history.replaceState(null, null, `#${closestPanel}`);
        } catch (err) {
          /* ignore */
        }
      }
    }, [gridToPixels, panelLayout, PANEL_WIDTH, PANEL_HEIGHT, SNAP_THRESHOLD]);

    const animateZoomAndPositionTo = useCallback(
      (targetZoom, targetPosition, openMenu = false, closeMenu = false) => {
        if (zoomAnimationRef.current) {
          cancelAnimationFrame(zoomAnimationRef.current);
        }

        const startZoom = zoom;
        const startPos = { ...positionRef.current };
        const startTime = Date.now();
        const duration = 300;

        // if openMenu flag provided, we request menu open right away for responsiveness
        if (openMenu && onOpenMenu) {
          onOpenMenu();
          setIsZoomedOut(true);
          onZoomChange?.(true);
        }

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentZoom = startZoom + (targetZoom - startZoom) * eased;
          setZoom(currentZoom);

          setPosition({
            x: startPos.x + (targetPosition.x - startPos.x) * eased,
            y: startPos.y + (targetPosition.y - startPos.y) * eased,
          });

          if (progress < 1) {
            zoomAnimationRef.current = requestAnimationFrame(animate);
          } else {
            if (closeMenu && onCloseMenu) {
              onCloseMenu();
              setIsZoomedOut(false);
              onZoomChange?.(false);
            }
          }
        };

        animate();
      },
      [zoom, onOpenMenu, onCloseMenu, onZoomChange]
    );

    const handleCanvasClick = useCallback(
      (clientX, clientY) => {
        if (!isZoomedOut || dragThresholdRef.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        const worldX = (clickX - positionRef.current.x) / zoom;
        const worldY = (clickY - positionRef.current.y) / zoom;

        // Calculate target position to center the clicked point
        const targetX = rect.width / 2 - worldX;
        const targetY = rect.height / 2 - worldY;

        const maxX = 0;
        const minX = -PANEL_WIDTH;
        const maxY = 0;
        const minY = -PANEL_HEIGHT;

        const clampedX = Math.max(minX, Math.min(maxX, targetX));
        const clampedY = Math.max(minY, Math.min(maxY, targetY));

        animateZoomAndPositionTo(
          MAX_ZOOM,
          { x: clampedX, y: clampedY },
          false,
          true
        );
      },
      [isZoomedOut, zoom, PANEL_WIDTH, PANEL_HEIGHT, animateZoomAndPositionTo]
    );

    const triggerDragHint = useCallback(() => {
      setShowDragHint(true);
    }, []);

    const closeDragHint = useCallback(() => {
      setShowDragHint(false);
    }, []);

    // Wheel handling with fixed menu position
    const handleWheel = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        e.preventDefault();

        if (e.ctrlKey) {
          const delta = -e.deltaY;
          const isZoomingOut = delta < 0;
          const isZoomingIn = delta > 0;

          if (isZoomingOut && zoom >= MAX_ZOOM - 1e-6) {
            // Always zoom to centered menu position
            const menuPos = getMenuZoomPosition();
            animateZoomAndPositionTo(MENU_ZOOM, menuPos, true, false);
          } else if (isZoomingIn && zoom <= MENU_ZOOM + 1e-6) {
            // Zoom into the pointer location
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - positionRef.current.x) / zoom;
            const worldY = (mouseY - positionRef.current.y) / zoom;

            const targetX = rect.width / 2 - worldX;
            const targetY = rect.height / 2 - worldY;

            const maxX = 0;
            const minX = -PANEL_WIDTH;
            const maxY = 0;
            const minY = -PANEL_HEIGHT;

            const clampedX = Math.max(minX, Math.min(maxX, targetX));
            const clampedY = Math.max(minY, Math.min(maxY, targetY));

            animateZoomAndPositionTo(
              MAX_ZOOM,
              { x: clampedX, y: clampedY },
              false,
              true
            );
          } else if (zoom > MENU_ZOOM && zoom < MAX_ZOOM) {
            const zoomSpeed = 0.0016;
            const newZoom = Math.max(
              MENU_ZOOM,
              Math.min(MAX_ZOOM, zoom + delta * zoomSpeed)
            );

            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const pointX = (mouseX - positionRef.current.x) / zoom;
            const pointY = (mouseY - positionRef.current.y) / zoom;

            const newX = mouseX - pointX * newZoom;
            const newY = mouseY - pointY * newZoom;

            setZoom(newZoom);
            setPosition({ x: newX, y: newY });

            if (newZoom <= MENU_ZOOM && !isZoomedOut) {
              onOpenMenu?.();
              setIsZoomedOut(true);
              onZoomChange?.(true);
            } else if (newZoom > MENU_ZOOM && isZoomedOut) {
              onCloseMenu?.();
              setIsZoomedOut(false);
              onZoomChange?.(false);
            }
          }
          return;
        }

        if (!isZoomedOut && zoom >= MAX_ZOOM) {
          triggerDragHint();
        }
      },
      [
        zoom,
        isZoomedOut,
        onOpenMenu,
        onCloseMenu,
        animateZoomAndPositionTo,
        MENU_ZOOM,
        MAX_ZOOM,
        triggerDragHint,
        onZoomChange,
        isSimpleScroll,
        getMenuZoomPosition,
        PANEL_WIDTH,
        PANEL_HEIGHT,
      ]
    );

    useEffect(() => {
      if (isSimpleScroll) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener("wheel", handleWheel);
      };
    }, [handleWheel, isSimpleScroll]);

    useEffect(() => {
      if (zoom <= MENU_ZOOM + 1e-5 && !isZoomedOut) {
        onOpenMenu?.();
        setIsZoomedOut(true);
        onZoomChange?.(true);
      } else if (zoom > MENU_ZOOM + 0.02 && isZoomedOut) {
        onCloseMenu?.();
        setIsZoomedOut(false);
        onZoomChange?.(false);
      }
    }, [zoom, isZoomedOut, onOpenMenu, onCloseMenu, onZoomChange]);

    useEffect(() => {
      return () => {
        if (zoomAnimationRef.current)
          cancelAnimationFrame(zoomAnimationRef.current);
        if (dragHintTimeoutRef.current)
          clearTimeout(dragHintTimeoutRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      };
    }, []);

    useEffect(() => {
      try {
        const hash = (window.location.hash || "").replace("#", "");
        if (hash && panelLayout[hash]) {
          setActiveSection(hash);
          if (isSimpleScroll && canvasRef.current) {
            const el = canvasRef.current.querySelector(`#${hash}`);
            if (el) {
              setTimeout(() => el.scrollIntoView({ behavior: "instant" }), 0);
            }
          } else {
            const p = gridToPixels(
              panelLayout[hash].gridX,
              panelLayout[hash].gridY
            );
            const targetPos = { x: -p.x, y: -p.y };
            setPosition(targetPos);
            setVelocity({ x: 0, y: 0 });
          }
        } else {
          const p = gridToPixels(
            panelLayout.home.gridX,
            panelLayout.home.gridY
          );
          const targetPos = { x: -p.x, y: -p.y };
          setPosition(targetPos);
        }
      } catch (err) {
        /* ignore */
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        navigateToSection: (sectionId) => {
          const panel = panelLayout[sectionId];
          if (!panel) return;

          if (isSimpleScroll && canvasRef.current) {
            const sectionEl = canvasRef.current.querySelector(`#${sectionId}`);
            if (sectionEl) {
              sectionEl.scrollIntoView({ behavior: "smooth" });
              setActiveSection(sectionId);
            }
            return;
          }

          const targetPos = gridToPixels(panel.gridX, panel.gridY);
          const duration = 600;
          const startPos = { ...positionRef.current };
          const startZoom = zoom;
          const targetZoom = MAX_ZOOM;
          const startTime = Date.now();

          if (isZoomedOut && onCloseMenu) {
            onCloseMenu();
            setIsZoomedOut(false);
            onZoomChange?.(false);
          }

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased =
              progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            setPosition({
              x: startPos.x + (-targetPos.x - startPos.x) * eased,
              y: startPos.y + (-targetPos.y - startPos.y) * eased,
            });

            setZoom(startZoom + (targetZoom - startZoom) * eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setVelocity({ x: 0, y: 0 });
              setActiveSection(sectionId);
            }
          };

          setVelocity({ x: 0, y: 0 });
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          animate();
        },
      }),
      [
        zoom,
        isZoomedOut,
        gridToPixels,
        panelLayout,
        onCloseMenu,
        onZoomChange,
        isSimpleScroll,
      ]
    );

    useEffect(() => {
      if (isSimpleScroll) return;

      const centerX = -position.x / zoom;
      const centerY = -position.y / zoom;

      let closestPanel = "home";
      let minDistance = Infinity;

      Object.entries(panelLayout).forEach(([key, panel]) => {
        const panelPos = gridToPixels(panel.gridX, panel.gridY);
        const distance = Math.hypot(centerX - panelPos.x, centerY - panelPos.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestPanel = key;
        }
      });

      if (activeSection !== closestPanel) {
        setActiveSection(closestPanel);
        try {
          window.history.replaceState(null, null, `#${closestPanel}`);
        } catch (err) {
          /* ignore */
        }
      }
    }, [
      position.x,
      position.y,
      zoom,
      activeSection,
      gridToPixels,
      panelLayout,
      isSimpleScroll,
    ]);

    useEffect(() => {
      if (isSimpleScroll) return;
      if (isDragging || isZoomedOut) return;

      let rafId = null;

      const step = () => {
        const vx = velocityRef.current.x;
        const vy = velocityRef.current.y;

        if (
          Math.abs(vx) <= VELOCITY_THRESHOLD &&
          Math.abs(vy) <= VELOCITY_THRESHOLD
        ) {
          setVelocity({ x: 0, y: 0 });
          snapTimeoutRef.current = setTimeout(() => {
            snapToNearestPanel();
          }, 80);
          return;
        }

        const newVelocity = {
          x: vx * FRICTION,
          y: vy * FRICTION,
        };

        let newPos = {
          x: positionRef.current.x + newVelocity.x,
          y: positionRef.current.y + newVelocity.y,
        };

        const maxX = 0;
        const minX = -PANEL_WIDTH * zoom;
        const maxY = 0;
        const minY = -PANEL_HEIGHT * zoom;

        if (Math.abs(newVelocity.x) > 1.0 || Math.abs(newVelocity.y) > 1.0) {
          newPos = applyEdgeResistance(newPos);
        } else {
          newPos.x = Math.max(minX, Math.min(maxX, newPos.x));
          newPos.y = Math.max(minY, Math.min(maxY, newPos.y));
        }

        setPosition(newPos);
        setVelocity(newVelocity);

        rafId = requestAnimationFrame(step);
      };

      if (
        Math.abs(velocity.x) > VELOCITY_THRESHOLD ||
        Math.abs(velocity.y) > VELOCITY_THRESHOLD
      ) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        rafId = requestAnimationFrame(step);
      }

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [
      velocity.x,
      velocity.y,
      isDragging,
      isZoomedOut,
      applyEdgeResistance,
      snapToNearestPanel,
      PANEL_WIDTH,
      PANEL_HEIGHT,
      zoom,
      isSimpleScroll,
    ]);

    const handleDragStart = useCallback(
      (clientX, clientY) => {
        if (isZoomedOut) return;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

        closeDragHint();

        setIsDragging(true);
        setDragStart({
          x: clientX - positionRef.current.x,
          y: clientY - positionRef.current.y,
        });
        setVelocity({ x: 0, y: 0 });
        lastMousePos.current = { x: clientX, y: clientY };
        lastTime.current = Date.now();
        dragThresholdRef.current = false;
      },
      [isZoomedOut, closeDragHint]
    );

    const handleDragMove = useCallback(
      (clientX, clientY) => {
        setMousePosition({ x: clientX, y: clientY });
        if (!isDragging) return;

        const deltaX = Math.abs(clientX - lastMousePos.current.x);
        const deltaY = Math.abs(clientY - lastMousePos.current.y);
        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
          dragThresholdRef.current = true;
        }

        const now = Date.now();
        const dt = now - lastTime.current;

        if (dt > 0) {
          const rawX = clientX - dragStart.x;
          const rawY = clientY - dragStart.y;

          const newPos = isZoomedOut
            ? { x: rawX, y: rawY }
            : applyEdgeResistance({ x: rawX, y: rawY });

          const vx = ((clientX - lastMousePos.current.x) / dt) * 16;
          const vy = ((clientY - lastMousePos.current.y) / dt) * 16;

          setPosition(newPos);
          setVelocity({ x: vx, y: vy });

          lastMousePos.current = { x: clientX, y: clientY };
          lastTime.current = now;
        }
      },
      [isDragging, dragStart.x, dragStart.y, isZoomedOut, applyEdgeResistance]
    );

    const handleDragEnd = useCallback(
      (e) => {
        if (isZoomedOut && !dragThresholdRef.current && e) {
          handleCanvasClick(e.clientX, e.clientY);
        }
        setIsDragging(false);
        if (!isZoomedOut) {
          if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = setTimeout(() => {
            snapToNearestPanel();
          }, 100);
        }
        dragThresholdRef.current = false;
      },
      [isZoomedOut, snapToNearestPanel, handleCanvasClick]
    );

    const handleMouseDown = useCallback(
      (e) => {
        if (isSimpleScroll) return;

        if (
          e.target.tagName === "A" ||
          e.target.tagName === "BUTTON" ||
          e.target.closest("a, button, input, textarea")
        ) {
          return;
        }
        if (isZoomedOut && menuRef?.current?.contains(e.target)) {
          return;
        }

        closeDragHint();

        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
      },
      [handleDragStart, isZoomedOut, menuRef, closeDragHint, isSimpleScroll]
    );

    const handleMouseMove = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        handleDragMove(e.clientX, e.clientY);
      },
      [handleDragMove, isSimpleScroll]
    );

    const handleMouseUp = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        handleDragEnd(e);
      },
      [handleDragEnd, isSimpleScroll]
    );

    const getTouchDistance = (touches) => {
      if (touches.length < 2) return 0;
      const [a, b] = touches;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const getTouchCenter = (touches) => {
      if (touches.length < 2) return { x: 0, y: 0 };
      const [a, b] = touches;
      return {
        x: (a.clientX + b.clientX) / 2,
        y: (a.clientY + b.clientY) / 2,
      };
    };

    const handleTouchStart = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        if (e.touches.length === 2) {
          pinchRef.current.active = true;
          pinchRef.current.startDistance = getTouchDistance(e.touches);
          pinchRef.current.hasTriggered = false;
          const center = getTouchCenter(e.touches);
          pinchRef.current.centerX = center.x;
          pinchRef.current.centerY = center.y;
          setIsDragging(false);
        } else if (e.touches.length === 1 && !isZoomedOut) {
          const touch = e.touches[0];
          handleDragStart(touch.clientX, touch.clientY);
        }
      },
      [handleDragStart, isZoomedOut, isSimpleScroll]
    );

    const handleTouchMove = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        if (e.touches.length === 2 && pinchRef.current.active) {
          e.preventDefault();
          const distance = getTouchDistance(e.touches);
          if (!pinchRef.current.startDistance) {
            pinchRef.current.startDistance = distance || 1;
          }
          const scale = distance / (pinchRef.current.startDistance || 1);

          if (scale < 0.92 && !isZoomedOut) {
            // Zoom out to centered menu position
            const menuPos = getMenuZoomPosition();
            animateZoomAndPositionTo(MENU_ZOOM, menuPos, true, false);
            pinchRef.current.hasTriggered = true;
          }
          if (scale > 1.08 && isZoomedOut) {
            // Zoom in to the pinch center
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const centerX = pinchRef.current.centerX - rect.left;
            const centerY = pinchRef.current.centerY - rect.top;

            const worldX = (centerX - positionRef.current.x) / zoom;
            const worldY = (centerY - positionRef.current.y) / zoom;

            const targetX = rect.width / 2 - worldX;
            const targetY = rect.height / 2 - worldY;

            const maxX = 0;
            const minX = -PANEL_WIDTH;
            const maxY = 0;
            const minY = -PANEL_HEIGHT;

            const clampedX = Math.max(minX, Math.min(maxX, targetX));
            const clampedY = Math.max(minY, Math.min(maxY, targetY));

            animateZoomAndPositionTo(
              MAX_ZOOM,
              { x: clampedX, y: clampedY },
              false,
              true
            );
            pinchRef.current.hasTriggered = true;
          }
          return;
        }

        if (e.touches.length === 1) {
          const touch = e.touches[0];
          handleDragMove(touch.clientX, touch.clientY);
        }
      },
      [
        handleDragMove,
        animateZoomAndPositionTo,
        isZoomedOut,
        isSimpleScroll,
        getMenuZoomPosition,
        zoom,
        PANEL_WIDTH,
        PANEL_HEIGHT,
      ]
    );

    const handleTouchEnd = useCallback(
      (e) => {
        if (isSimpleScroll) return;
        if (e.touches.length < 2) {
          pinchRef.current.active = false;
        }
        if (e.touches.length === 0) {
          handleDragEnd(null);
        }
      },
      [handleDragEnd, isSimpleScroll]
    );

    const toggleMenu = useCallback(() => {
      if (isZoomedOut) {
        // Zoom in to center of screen
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const worldX = (centerX - positionRef.current.x) / zoom;
        const worldY = (centerY - positionRef.current.y) / zoom;

        const targetX = centerX - worldX;
        const targetY = centerY - worldY;

        const maxX = 0;
        const minX = -PANEL_WIDTH;
        const maxY = 0;
        const minY = -PANEL_HEIGHT;

        const clampedX = Math.max(minX, Math.min(maxX, targetX));
        const clampedY = Math.max(minY, Math.min(maxY, targetY));

        animateZoomAndPositionTo(
          MAX_ZOOM,
          { x: clampedX, y: clampedY },
          false,
          true
        );
      } else {
        // Always zoom out to centered menu position
        const menuPos = getMenuZoomPosition();
        animateZoomAndPositionTo(MENU_ZOOM, menuPos, true, false);
      }
    }, [
      isZoomedOut,
      animateZoomAndPositionTo,
      getMenuZoomPosition,
      zoom,
      PANEL_WIDTH,
      PANEL_HEIGHT,
    ]);

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
          return;

        const panel = panelLayout[activeSection];
        if (!panel) return;

        let targetPanel = null;

        switch (e.key) {
          case "ArrowLeft":
          case "a":
          case "A":
            e.preventDefault();
            if (panel.gridX > 0) {
              targetPanel = Object.values(panelLayout).find(
                (p) => p.gridX === panel.gridX - 1 && p.gridY === panel.gridY
              );
            }
            break;
          case "ArrowRight":
          case "d":
          case "D":
            e.preventDefault();
            if (panel.gridX < 1) {
              targetPanel = Object.values(panelLayout).find(
                (p) => p.gridX === panel.gridX + 1 && p.gridY === panel.gridY
              );
            }
            break;
          case "ArrowUp":
          case "w":
          case "W":
            e.preventDefault();
            if (panel.gridY > 0) {
              targetPanel = Object.values(panelLayout).find(
                (p) => p.gridX === panel.gridX && p.gridY === panel.gridY - 1
              );
            }
            break;
          case "ArrowDown":
          case "s":
          case "S":
            e.preventDefault();
            if (panel.gridY < 1) {
              targetPanel = Object.values(panelLayout).find(
                (p) => p.gridX === panel.gridX && p.gridY === panel.gridY + 1
              );
            }
            break;
          case "m":
          case "M":
            e.preventDefault();
            toggleMenu();
            break;
          default:
            break;
        }

        if (targetPanel) {
          const targetPos = gridToPixels(targetPanel.gridX, targetPanel.gridY);
          setVelocity({ x: 0, y: 0 });
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          animateZoomAndPositionTo(
            MAX_ZOOM,
            { x: -targetPos.x, y: -targetPos.y },
            false,
            true
          );
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [
      activeSection,
      gridToPixels,
      panelLayout,
      animateZoomAndPositionTo,
      toggleMenu,
    ]);

    const renderPanels = useCallback(() => {
      return Object.entries(panelLayout).map(([key, panel]) => {
        const panelPos = gridToPixels(panel.gridX, panel.gridY);
        const SectionComponent = panel.component;
        const isActive = key === activeSection;

        return (
          <div
            key={key}
            id={key}
            className="absolute"
            style={{
              left: `${panelPos.x}px`,
              top: `${panelPos.y}px`,
              width: `${PANEL_WIDTH}px`,
              height: `${PANEL_HEIGHT}px`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500 z-10"
              style={{
                border: `3px solid ${accentColor}`,
                opacity: isActive && !isZoomedOut ? 0.5 : 0.15,
                boxShadow:
                  isActive && !isZoomedOut
                    ? `0 0 40px ${accentColor}40, inset 0 0 40px ${accentColor}20`
                    : "none",
              }}
            />
            <div className="w-full h-full overflow-hidden relative z-20">
              <SectionComponent
                accentColor={accentColor}
                mainBgColor={mainBgColor}
                menuThemeColor={menuThemeColor}
                textColor={textColor}
                isDarkTheme={isDarkTheme}
              />
            </div>
          </div>
        );
      });
    }, [
      activeSection,
      isZoomedOut,
      accentColor,
      mainBgColor,
      menuThemeColor,
      textColor,
      isDarkTheme,
      gridToPixels,
      PANEL_WIDTH,
      PANEL_HEIGHT,
      panelLayout,
    ]);

    const getNavigationState = useCallback(() => {
      const panel = panelLayout[activeSection];
      if (!panel)
        return {
          canGoLeft: false,
          canGoRight: false,
          canGoUp: false,
          canGoDown: false,
        };

      return {
        canGoLeft: panel.gridX > 0,
        canGoRight: panel.gridX < 1,
        canGoUp: panel.gridY > 0,
        canGoDown: panel.gridY < 1,
      };
    }, [activeSection, panelLayout]);

    const navState = getNavigationState();

    if (isSimpleScroll) {
      const mobileOrder = ["home", "about", "projects", "contact"];

      return (
        <div
          ref={canvasRef}
          className="relative w-full h-screen overflow-auto -webkit-overflow-scrolling-touch"
          style={{
            backgroundColor: mainBgColor,
            WebkitOverflowScrolling: "touch",

            overflowY: "auto",
          }}
        >
          <div className="flex flex-col">
            {mobileOrder.map((key) => {
              const panel = panelLayout[key];
              if (!panel) return null;
              const SectionComponent = panel.component;
              return (
                <section
                  id={key}
                  key={key}
                  className="w-full"
                  style={{
                    minHeight: "100vh",
                    width: "100%",
                    boxSizing: "border-box",
                    borderBottom: `1px solid ${accentColor}20`,
                    backgroundColor: mainBgColor,

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      minHeight: "100vh",
                    }}
                  >
                    <SectionComponent
                      accentColor={accentColor}
                      mainBgColor={mainBgColor}
                      menuThemeColor={menuThemeColor}
                      textColor={textColor}
                      isDarkTheme={isDarkTheme}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={canvasRef}
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundColor: mainBgColor,
          cursor: isDragging ? "grabbing" : isZoomedOut ? "pointer" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => handleDragEnd(null)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute origin-top-left transition-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            transitionDuration: isDragging ? "0ms" : "150ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
        >
          {renderPanels()}
        </div>
        <button
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 group transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label={isZoomedOut ? "Close menu" : "Open menu"}
          title={
            isZoomedOut ? "Click to close menu (M)" : "Click to open menu (M)"
          }
        >
          <div className="relative">
            {!isZoomedOut && (
              <>
                {navState.canGoUp && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderBottom: `8px solid ${accentColor}`,
                      filter: `drop-shadow(0 2px 4px ${accentColor}40)`,
                      animation: "float-up 2s ease-in-out infinite",
                    }}
                  />
                )}
                {navState.canGoDown && (
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `8px solid ${accentColor}`,
                      filter: `drop-shadow(0 -2px 4px ${accentColor}40)`,
                      animation: "float-down 2s ease-in-out infinite",
                    }}
                  />
                )}
                {navState.canGoLeft && (
                  <div
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderRight: `8px solid ${accentColor}`,
                      filter: `drop-shadow(2px 0 4px ${accentColor}40)`,
                      animation: "float-left 2s ease-in-out infinite",
                    }}
                  />
                )}
                {navState.canGoRight && (
                  <div
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderLeft: `8px solid ${accentColor}`,
                      filter: `drop-shadow(-2px 0 4px ${accentColor}40)`,
                      animation: "float-right 2s ease-in-out infinite",
                    }}
                  />
                )}
              </>
            )}
            <div className="relative">
              <div
                className="absolute inset-0 translate-x-1 translate-y-1 blur-sm transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:blur-md"
                style={{
                  transform: "skewX(-12deg)",
                  backgroundColor: `${accentColor}20`,
                }}
              />
              <div
                className="relative px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-sm transition-all duration-300 group-hover:backdrop-blur-md"
                style={{
                  transform: "skewX(-12deg)",
                  backgroundColor: `${menuThemeColor}98`,
                  border: `2px solid ${accentColor}80`,
                  boxShadow: `0 2px 8px ${accentColor}20`,
                }}
              >
                <div
                  className="flex items-center gap-2.5"
                  style={{ transform: "skewX(12deg)" }}
                >
                  <p
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 group-hover:tracking-widest"
                    style={{
                      color: accentColor,
                      textShadow: `0 0 8px ${accentColor}30`,
                    }}
                  >
                    {isZoomedOut
                      ? "Zoom In"
                      : panelLayout[activeSection]?.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>

        {!isTouchDevice && (
          <div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 px-4 py-3 rounded-lg backdrop-blur-sm transition-opacity duration-300"
            style={{
              backgroundColor: `${menuThemeColor}80`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <div className="text-xs space-y-1" style={{ color: textColor }}>
              <div className="font-bold mb-2 opacity-90">⌨️ Shortcuts</div>
              <div className="opacity-75">WASD / Arrows - Navigate</div>
              <div className="opacity-75">M - Toggle Menu</div>
              <div className="opacity-75">Drag - Explore</div>
            </div>
          </div>
        )}
        {!isTouchDevice && (
          <div
            className="fixed w-4 h-4 rounded-full pointer-events-none z-50 transition-opacity duration-300"
            style={{
              left: mousePosition.x - 8,
              top: mousePosition.y - 8,
              backgroundColor: accentColor,
              opacity: isDragging ? 0.3 : 0,
              boxShadow: `0 0 20px ${accentColor}`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    );
  }
);

MainContent.displayName = "MainContent";

export default MainContent;
