import { getProjectById } from "@/api/projectsApi";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../node_modules/react-toastify/dist/index";

function ProjectView() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
      const loadProject = async () => {
        try {
            const proj = await getProjectById(id); // <- fetch only this project
            setProject(proj);                       // <- set it to state
            console.log(proj);
        } catch (err) {
          console.error(err);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      loadProject();
    }, [id]);

}

export default ProjectView;