import React from "react";
import moment from "moment";

const Footer = () => {
  const date = moment().format("YYYY");
  return (
    <div className="footerCopyRightDivStyle">
      <p className="titleStyle">
        Copyright &copy; {date} Employee Management System. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
