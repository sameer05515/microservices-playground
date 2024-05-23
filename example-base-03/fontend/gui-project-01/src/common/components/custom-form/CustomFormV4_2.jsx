import React, { useRef, useImperativeHandle, forwardRef } from "react";

const CustomFormV4_2 = forwardRef((props, ref) => {
  const { onSave, ...otherProps } = props;
  const formRef = useRef(null);

  // Setup imperative handle for parent components
  useImperativeHandle(ref, () => ({
    clear: () => {
      // console.log("CLEARING FORM");
      formRef.current?.reset();
    },
  }));

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} {...otherProps}>
      {props.children}
    </form>
  );
});



export default CustomFormV4_2;
