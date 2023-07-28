function addListener(component: any) {
  component._resizeEventListener = {
    handleEvent: () => {
      component.resize();
    },
  };

  window.addEventListener("resize", component._resizeEventListener);
}

function removeListener(component: any) {
  window.removeEventListener("resize", component._resizeEventListener);
}

export default { addListener, removeListener };
