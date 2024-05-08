# Table Illustrator: Puzzle-based Authoring of Plain Tables

This is an implementation of the paper "Table Illustrator: Puzzle-based Authoring of Plain Tables" (accepted by CHI'24). The current repo is the frontend. The backend can be found [here](https://github.com/Ais0n/Tableshop.backend). The online demo based on this implementation can be found [here](https://yhuang.top/tableshop/). For more details please refer to the [paper](https://yhuang.top/pdf/chi24_Table_Illustrator.pdf). 

# How to build (For developers)

- Run ``npm run release`` in the BACKEND repo.

- Copy the file ``release/tableshop.js`` in the backend to ``src/process/tableshop.js`` in the frontend.

- Run ``vite`` to start the server.