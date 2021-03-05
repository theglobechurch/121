import React from "react";
import { string } from "prop-types";

const Icon = ({ classname, icon }) => (
  <svg className={classname}>
    <use
      xlinkHref={`/one21icons.svg#${icon}`}
    />
  </svg>
);

Icon.propTypes = {
  classname: string,
  icon: string.isRequired,
};

Icon.defaultProps = {
  classname: null,
};

export default Icon;
