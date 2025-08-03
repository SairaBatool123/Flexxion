import React from 'react'
import {NavLink, useRouteError } from 'react-router-dom';
// import styles from "./Error.module.css";



function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  
  return (
    <>
      <div>
        <section className='main-secc'>
          <h1>
            4
            <span className="span">
              <i className="fas fa-ghost"></i>
            </span>
            4
          </h1>
          <h2>Error: 404 page not found</h2>
          <p className="para">
            Sorry, the page you're looking for cannot be accessed
          </p>
          <NavLink to="/">
            <button>Go Home</button>
          </NavLink>
        </section>
      </div>
    </>
  );
}

export default ErrorPage