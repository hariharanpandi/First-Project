import { ResourceEmpty } from "../../assets/icons/ResourceEmpty";

export const EmptyCanvas = () => {
  return (
    <div className="display-empty-canvas">
      <ResourceEmpty />
      <p className="drag-drop">Drag and Drop here</p>
      <p className="discription">Drag and drop resources into the canvas
        from the sidebar to build your resource chart.</p>
    </div>
  );
};
