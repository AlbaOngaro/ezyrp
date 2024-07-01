import colors from "tailwindcss/colors";
import { BezierEdge, EdgeProps } from "reactflow";

export function DefaultEdge(props: EdgeProps) {
  return (
    <BezierEdge
      {...props}
      style={{
        stroke: props.selected ? colors.gray[400] : colors.gray[300],
        strokeWidth: 2,
      }}
    />
  );
}
