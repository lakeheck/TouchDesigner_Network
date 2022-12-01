# Fluid Sim in TouchDesigner 

Cross implemented in WebGL https://github.com/lakeheck/WebGL-Fluid-Simulation/blob/master/README.md

##Overview 
## Overview 
A fluid simulation implemented fully on the GPU in TouchDesigner. Based on Jos Stam’s seminal paper using Navier-Stokes equations and a grid-based approach to model fluids, this simulation runs in real time at high resolutions (up to 5,000x5,000 pixels) and is highly versitle. 

As Stam notes, the Navier-Stokes equations describe the evolution of a velocity field over time. This velocity field represents our fluid and is composed from several intermediate layers: 

Curl - the rotational nature of the fluid at a point 

Divergence - the flow into or out of a grid point in a unit of time 

Advection - the movement of materials in a fluid (in this case, the “dye” we use to color the simulation)

Pressure - a Poisson solver to solve the pressure equation

These intermediate layers are each a fragment shader, with parameters (i.e. shader uniforms) controlling the interaction of various components: 

Vorticity (or viscosity) controls the degree to which the curl influences the divergence calculation 

Pressure controls the degree to which changes in volume result in directional acceleration 

Diffusion (for both color and velocity) determines how resistive the fluid is to flow, i.e. the momentum of advection 

Pressure passes indicate the number of iterations in our Poisson solver 


## References

Forked from https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

NVDIA guide to implementing fluid simulations on the GPU - http://developer.download.nvidia.com/books/HTML/gpugems/gpugems_ch38.html

Fluid simulation in TouchDesigner - https://www.youtube.com/watch?v=2k6H5Qa_fCE

Real-Time Fluid Dynamics for Games by Jos Stam - http://graphics.cs.cmu.edu/nsp/course/15-464/Spring11/papers/StamFluidforGames.pdf

## License

The code is available under the [MIT license](LICENSE)
