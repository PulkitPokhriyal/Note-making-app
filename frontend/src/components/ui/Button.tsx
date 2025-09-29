interface Buttonprops {
  text: string;
  size: "sm" | "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const sizeStyles = {
  sm: "w-40",
  md: "w-80",
  lg: "w-96",
};

export const Button = (props: Buttonprops) => {
  return (
    <button
      className={`bg-blue-600 ${sizeStyles[props.size]} text-white rounded-lg px-4 py-2 text-md hover:cursor-pointer hover:bg-blue-700`}
      onClick={props.onClick}
      type={props.type}
      disabled={props.loading}
    >
      {props.text}
    </button>
  );
};
