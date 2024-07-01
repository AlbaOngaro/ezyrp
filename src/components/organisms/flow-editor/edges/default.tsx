import colors from "tailwindcss/colors";
import { BezierEdge, EdgeProps } from "reactflow";

export function DefaultEdge(props: EdgeProps) {
  return (
    <BezierEdge
      {...props}
      style={{
        stroke: props.selected ? colors.blue[500] : colors.blue[300],
        strokeWidth: 2,
      }}
    />
  );
}
