import './Map.css'
import '/src/Components/display.css'
import { useState, useEffect } from 'react'
import React from 'react'
import jaguiImage from '../../assets/jagui.png'
import { Link } from 'react-router-dom';
import { supabase } from '../../client';

function Map(){

  const [departmentsData, setDepartmentsData] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [departmentInfo, setDepartmentInfo] = useState({});
  const [randomPlaceIndex, setRandomPlaceIndex] = useState(0);
  const [selectedDept, setSelectedDept] = useState({});

  useEffect(() => {
  // Función para obtener los datos de la tabla 'departments'
    const fetchDepartmentsData = async () => {
      try {
      const { data, error } = await supabase.from('departments').select('*');
      if (error) throw error;
      setDepartmentsData(data);
      } catch (error) {
      console.error('Error al obtener los datos de departamentos:', error.message);
      }
    };
  
    // Función para obtener los datos de la tabla 'places'
    const fetchPlacesData = async () => {
      try {
      const { data, error } = await supabase.from('places').select('*');
      if (error) throw error;
      setPlacesData(data);
      } catch (error) {
      console.error('Error al obtener los datos de lugares:', error.message);
      }
    };

    // Llama a ambas funciones para obtener los datos cuando el componente se monta
    fetchDepartmentsData();
    fetchPlacesData();
    }, []); 

    useEffect(() => {
      // Merge department and place data
      const mergedData = {};
      
      departmentsData.forEach((department) => {
        const placeInfo = placesData.find((place) => place.id_departments === department.id_departments);
        if (placeInfo) {
        mergedData[department.id_departments] = { ...department, ...placeInfo };
        } else {
        mergedData[department.id_departments] = { ...department };
        }
      });
      
      setDepartmentInfo(mergedData);
      }, [departmentsData, placesData]);
  
      const getDepartmentPlaces = (departmentsData) => {
        // Supongamos que tienes una lista de lugares en placesData y cada lugar tiene un campo id_departments
        const departmentId = departmentsData;
    
        const departmentPlaces = placesData.filter((place) => place.id_departments === departmentId);
  
        return departmentPlaces;
      };
  
       
  const handleDepartmentClick = (departmentsData) => {
    const departmentPlaces = getDepartmentPlaces(departmentsData);
    console.log("Department Places:", departmentPlaces);

    setSelectedDept((prevSelectedDept) => ({
    ...prevSelectedDept,
    ...departmentsData,
    places: departmentPlaces,
    }));
  };
  useEffect(() => {
    if (selectedDept && selectedDept.places && Array.isArray(selectedDept.places)) {
      const randomIndex = Math.floor(Math.random() * selectedDept.places.length);
      setRandomPlaceIndex(randomIndex);
    } else {
      console.error("selectedDept o selectedDept.places no están definidos o no son un array válido.");
    }
  }, [selectedDept]);
    
  return (
    <div>
    <div className="root">
      <div className="Titles">
      <h5>¡Bienvenido a Visita Nuestras Tierras!</h5>
      <h7>Presiona cualquier departamento para ver algún lugar. (Sigue presionando y veras uno diferente cada vez!)</h7>
      </div>
        <div className="mapadiv">
        <svg version="1.2" viewBox="0 0 1000 1056" xmlns="http://www.w3.org/2000/svg">
          <a xlinkTitle="Baja Verapaz" className="card">
            <path d="M564.6 689.2l-6.7 3.7-9.5 6.5-21.2 14.3-39.3 27.4-4 12.6-1.2 4.1-12.6 2.1-8.2-1.5-3.1-3-1.1-3-2-1.7-4 0.8-2 1.5-0.6 1.5-1 1.3-3.3 0.8-2.9 0.3-2.4-0.3-1.8-1.1-1.2-2.4-1.9 0-4 2.3-6.3 2.3-6.2 1.3-3.8-0.6-1.5 0-1.1 0.6-1.1 0.3-1.3-0.5-1.9-2.2-3.7 0.7-8.8-3.2-2.9-6.6-1.1-2.4-1.8-1.7-1.6-1.1-1.7-1.5-4.5-4.6 1.1-5.6 0.2-1.2-22.4-14.1-18.5-24 1.6-27.9 2 1.1 41.2 9.7 29 1.3 8.2-0.7 9.3-12.8 5.8 0.3 5.6 0.1 8.4 0.2 5.8-0.2 5.4 1.7 13.6 9.3 2.7 2.6 0.7 0.2 1-0.1 2.5-1.4 0.9-1 3.1-3.8 1.1-1 1.7-2.5 2-7.9 0.2-1.6 0.8-1.8 0.9-0.9 1-0.8 3.4 0.2 11.9 2.9 27.1 3.8 9.7-0.3 8.1-3.2 2.3-0.6 11.1-0.9 1.7 0.4 1.9 1.1 2.8 2.7 1.1 1.4 0.6 1.2 0.5 1.2-0.2 2.6-2.6 7.5-11 15.8z" id="GTM1942" name="Baja Verapaz"onClick={() => handleDepartmentClick(5)}/>
          </a>
          <a xlinkTitle="Huehuetenango">
            <path d="M231.8 661.8l-6.4-0.4-2.9 0.5-6 2.7-3.8 2.8-10.8 2.5-2.4 0.7-1.3 0.7-0.9 0.9-3.2 4.8-1.5 2.9-0.2 0.7-0.5 6.5-0.2 0.8-2 1-8.4 0.5-4.8-6-0.8-2.3 0.1-2.6-1.9-1.5-16.7-4.3-1.3-3.5-2.4-2.4-2.5-1.7-4.9-4.2-4.6-4.9-4.1-5.8-3.5-6.3-1.2-3.5-0.2-1-3.8 0.1-13.5 3.8-5.3-0.4-8.4-5.3-2.2-1-1.6 0.1-1.7 0.6-4.2 2.6-7.5 4.7-8.1 0.7-3.4 2.2-8.3 9.7-0.7 0.8-12.7-0.6-2.7-2.1-2.5-26.7-0.6-3.8-3.7-1.4-4.3-5.5-1.5-5.3 9.3-16.1 19.5-34 19.6-34 17.1-29.7 12.1-21.1 4.6-7.9 5.6-9.8 2.9-3.8 4-2 45.5-0.1 34.2 0 34.1-0.1 34.2-0.1 32.8 0-30.4 60.8-2.4 4.7-16.2 33.1-0.6 0.8-4.6 4.5 0.3 1.7 0.5 1.1-0.5 0.4-0.9 0.4-2.1 0.2-1 0.2-1 1.4-6.7 4.8-0.9 0.1-1.5 0-1.5 0.3-0.5 0.3-3.1 2.7-2 0.5-0.7-0.1-0.7 0.5-0.6 1-0.4 3.1-0.6 2.5-1.5 2.9-0.8 1.2-0.8 2.4-0.3 6-1.4 2.3-0.5 1.2-0.3 1.5 0.2 2.4 0.4 1.4 1.1 2.3 0.8 1.1 5 6.1 0.6 1.5 0 3.3 0.3 1.5 1 2.4 1.4 2.3 1.6 1.7 4.6 4.4 1 0.2 1.4 0 7.3-0.9 3.1 0.7 6.9 3.2 0.5 4.6-2.1 9.3 0.2 1.4 1.5 3.9 1.2 5.1-3.8 0.9-2.2 0.2-6.1-1.1-2.2 0.1-5.7 1.9-10.7 2-2 1.3-1.1 2.2z" id="GTM1943" name="Huehuetenango"onClick={() => handleDepartmentClick(2)}/>
          </a>
          <a xlinkTitle="Petén">
            <path d="M747.3 496.1l-1.6-1.3-5.8-0.8-22.8 0.4-2.9 2.9-1.6 4.3-0.4 1.8-0.7 1.7-1 0.9-2.9 1.8-7.5 1.8-3 1.4-1.9-0.2-4.2-2.3-5.3 1.1-6.6 3-0.5-0.2-0.6-13.4-0.2-0.6-1-0.5-1.6-0.1-3.4 0.2-2.6 0.7-1.1 0.7-1.4 0.4-0.9 0-15.4-2.1-1.7 0.1-2.9 2.4-1.2 0.6-1.4 0.3-3.3-0.2-1.1-0.4-1.4-0.7-5.2-3.5-3.9-3.4-0.7-0.4-5.9-2.7-1.4-0.3-2.3 1.5-0.7 0.1-2.2-0.2-1.4 0.2-0.9 0.9-1 1.5-1 0.8-1.4 0.4-8.3 0.5-3.9-0.6-1-0.1-1.6 0.3-0.8-0.3-0.9-0.8-1.2-2.3-0.4-1.3-0.6-1.5-3.2-4.4-0.9-1.6-0.7-1-0.6-0.3-1.4 0.2-2.4-0.3-4.3-3-1.1 1.2-0.6 0.2-2.8-0.6-4.2-3.2 0.6-1.8-0.1-0.5-1.2-0.9-0.3-0.6 0.4-1.4 0-0.6-0.9-0.8-1.8-0.8-1 0 0 0.7 0.5 2 0 0.9-0.6 0.5-2 0.4-1.4 0.4-0.6-0.1-0.9-1.1-1.1-0.1-1.4 0.3-0.9-0.2-0.7-0.9-0.2-0.8-0.6-0.8-1.1-0.2-2.8 0.4-1 0.6-0.7 0.7-0.3 0.9-0.4 0.3-1.7-0.2-42.1-13.6-50.6-7.8-6.7 0.7 0.9-1.3 1.7-3.7 0.7-2.1-2.5 1-0.9 0.9-1.8 0-1-4.4 6-5-3.2-3.1 0-1.6 5.5-2.3-1.7-2.6-7.2-4.1-0.9-4.9 1.7-3.5 3.1-2.4 2.9-1.4-3.4-1.3-2.4-2-0.4-2.6 2.8-3.1 1.1 1.1 0.8 0.4 3.2 0.5-1-1.4-1.5-2.9-0.9-1.4 1.1 0.2 0.3-0.4 0.3-1.4 1.5 1.1 2 0.5 1.6-0.6 0-2.7-1.6 0.6-3.6-1.4-2.5-1.8 1.7-1 4.6-1.4 3.7-3.6 1.4-4.1-2-3.4-1.7 0 0 2-1.7 0 0.6-3.7 2.4-1.3 3.3 0.2 3.8 1.1-2.8-4.9-0.4-1.4 0-3.4-0.5-3.8-1.4-0.3-2.2 1-2.8 0.4-1.5-0.7-1.8-1.2-2.6-1.1-7.8-1-0.6-1.5 0.3-2.2-1.3-2.9-1.4-1.4-2.4-1.7-2.8-0.8-5.9 2.9-1.5-2.3-1.2-5.5-2.4 0-6.4 1.9-1.4 0.7-1.4-0.9-3.5-0.7-4-0.1-3.1 0.9 1.3-2.5 2.2-1.9 1.8-1.9-0.2-2.7-2.8-1.8-3.8-0.3-2.2-0.9 2-4-0.8-4.1 1.6-4.4 0.8-3.7-3.4-2.1-0.7 1.8-0.8 0.8-1.3 0.4-2.1 0.4 0-1.6 3.3-6-3.4-9.4-16.8-24.3-3.6-2.9-8.9-4.5-3.6-3 0.8-3.1 0-1.8-3.4-1.9-2.3 2-2.9-0.1-17.1-5.3-4.6-2.7-7.2-7.3-5.1-2.5 4-4.3-0.6-2.1-3.4-0.5-4.3-0.1-0.4 1.1 0.9 2.4 0.2 2.4-2.4 1.1-1.3-0.8-3.1-3.4-1.5-1.1-9.4-3.5-3-2.6-1.1-5.4-1.4-2.7-8.7-10.6-1-2.3-1.3-5-1.3-1.6-2.6-0.5-6 0.7-2.5-1.1-8.8-9.7-2.3-3.6-1-2.6-1.3-4.6-1-1.8-2.3-1.4-5.1-1.3-1-1.6-0.5-4.1-1.4-4.7-2.1-4.1-2.7-2.3-6.8-0.4-6.6 1.1-5.1-0.9-2-6.2-3.8-2-7.7-1.6-5.7-2.7 1-4.1 1.9-0.3 108.8 0.8 0.2-143.1 2-2.3 5.1-1.4 10.7 0 109 0.1 54.5 0.1 54.6 0 54.4 0.1 54.5 0 109.1 0.1 2.4 128.4 0.3 74-4.1 67.2-4.6 72.8-2.1 26.7-3.9 53.4-6.3 59.7-0.5 12.5z" id="GTM1944" name="Petén"onClick={() => handleDepartmentClick(1)}/>
          </a>
          <a xlinkTitle="Quezaltenango">
            <path d="M181.3 689.4l-4.3 1.4-12.7 5-1.1 0.6-0.5 2.1 1.3 7.4 7.1 27.2 1.8 2.4 4.2 3.8-0.1 3-0.5 1.4 0 1.6 0.5 1.7 3.9 4.7 0.7 1 1.7 0.6 4.8-0.6 5.2-0.2 2.2 5 0.7 7.7 2.7 2.5 4.9 8.6-3 10-7.3 10-10.1 6.8-3.9-1.6-3-0.3-1.5 0.5-5.1 3.4-1.5 0.7-1.2 0.4-0.8 0-1.3-0.3-1.5-0.6-2.6-0.7-1.6 0.4-0.8 0.9-1.7 2.8-1.3 1.7-1.8 2.1-1.6 0.3-1.5-0.9-1.4-0.4-1.4 0.8-0.7 1.7-2.3 2.2-2-0.1-1.4-0.5-3.1-0.5-1.2-0.7-0.7-0.7 0.7-4.5 3.5-8.4 0.4-3.2-0.7-1.2-1.5-0.3-1.1 0.2-1.4 0.7-1 0.7-1.9 1.6-3.3 3.7-8.9 4.3-1.7 2.7-2.1 7-1.1 2.5-4.5 6.7-1.1 2.3-0.8 2.3-0.9 3.7-0.6 1.7-0.5 1-2.5 2.9-7.7 11.6-10.3 2.4-7.3 0.6-2.8-0.4-14.5-6.3-1.1-0.3-1.9 0.7-2 1.4-5.9-17.5-2.2-4.4-0.7-0.3-2.1-0.5-14.7-1.6-1.3-0.3-2.1-0.8-0.8-0.8-0.3-0.7 1-1.6 8.5-9.8 6.8-5.5 2.9-1.5 5.3-1 21.8-6.3 15.5 1.7 7 0.4 2.5-0.3 2.1-0.9 2.5-1.5 3.2-5.9 1.7-2.2 3.3-2.4 0.9-0.9 0.6-1 0.2-0.8 6.7-14.2 2.3-4 1.6-9.6 2.3-3.2 0.4-2.4-0.2-1.8 0.7-1.8 2-1.2 1.9-0.8 7.2-7.1 2-2.8 1-2.6 1.6-11-1.1-4.1-4.7-4-2.9-7.1 2.2-7.7 4.8-7 4.5-4.8 8.6-7 1.6-1.7 1.1-4.8 16.7 4.3 1.9 1.5-0.1 2.6 0.8 2.3 4.8 6z" id="GTM1945" name="Quetzaltenango"onClick={() => handleDepartmentClick(7)}/>
          </a>
          <a xlinkTitle="Retalhuleu">
            <path d="M183.4 803.1l-7.4 6.7-5.7 6.3-0.6 1-0.8 1.6-0.2 0.7-0.1 2.9 0.3 5.8-9.8 20.1-0.1 1.6 0.2 1.6-2 15 0.2 1.5 0.9 2.7 3.1 5.6 0.1 1.9-1.1 16.6 0.2 3.4-0.4 2.9-2.8 4.2-3.1 9.4-1.1 7.7-0.5 8.4-0.3 1.6-0.3 0.6-7.1 10.5 1.5 10.2 0.2 2.1-25.8-16.1-36.1-26.5-35-31.8-28-20.3 0.4-0.7 1.7-0.5 2.6 0.7 1.2-0.1 1.2-0.6 2.2-1.6 2.3-2 2-0.6 2.5 0.2 2.3 0.5 1.3 0.5 1.5 0.1 1.6-0.5 1-0.7 2.8-3 2.1-1.1 7.4-1.8 2-1.4 1.9-0.7 1.1 0.3 14.5 6.3 2.8 0.4 7.3-0.6 10.3-2.4 7.7-11.6 2.5-2.9 0.5-1 0.6-1.7 0.9-3.7 0.8-2.3 1.1-2.3 4.5-6.7 1.1-2.5 2.1-7 1.7-2.7 8.9-4.3 3.3-3.7 1.9-1.6 1-0.7 1.4-0.7 1.1-0.2 1.5 0.3 0.7 1.2-0.4 3.2-3.5 8.4-0.7 4.5 0.7 0.7 1.2 0.7 3.1 0.5 1.4 0.5 2 0.1 2.3-2.2 0.7-1.7 1.4-0.8 1.4 0.4 1.5 0.9 1.6-0.3 1.8-2.1 1.3-1.7 1.7-2.8 0.8-0.9 1.6-0.4 2.6 0.7 1.5 0.6 1.3 0.3 0.8 0 1.2-0.4 1.5-0.7 5.1-3.4 1.5-0.5 3 0.3 3.9 1.6z" id="GTM1946" name="Retalhuleu"onClick={() => handleDepartmentClick(10)}/>
          </a>
          <a xlinkTitle="San Marcos">
            <path d="M157.2 672.7l-1.1 4.8-1.6 1.7-8.6 7-4.5 4.8-4.8 7-2.2 7.7 2.9 7.1 4.7 4 1.1 4.1-1.6 11-1 2.6-2 2.8-7.2 7.1-1.9 0.8-2 1.2-0.7 1.8 0.2 1.8-0.4 2.4-2.3 3.2-1.6 9.6-2.3 4-6.7 14.2-0.2 0.8-0.6 1-0.9 0.9-3.3 2.4-1.7 2.2-3.2 5.9-2.5 1.5-2.1 0.9-2.5 0.3-7-0.4-15.5-1.7-21.8 6.3-5.3 1-2.9 1.5-6.8 5.5-8.5 9.8-1 1.6 0.3 0.7 0.8 0.8 2.1 0.8 1.3 0.3 14.7 1.6 2.1 0.5 0.7 0.3 2.2 4.4 5.9 17.5-7.4 1.8-2.1 1.1-2.8 3-1 0.7-1.6 0.5-1.5-0.1-1.3-0.5-2.3-0.5-2.5-0.2-2 0.6-2.3 2-2.2 1.6-1.2 0.6-1.2 0.1-2.6-0.7-1.7 0.5-0.4 0.7-20.8-15.1 5-0.8 4.5-5.4 5.4-15.2 5.3-9.9 1-3.9-0.2-4.9-4.4-12.6-0.2-1.8 0.3-3.8-0.1-2-2.3-6.3-0.6-2.2-0.2-5.4 1.2-3 5.2-6.1 2.8-7.7-0.7-16 0.8-8.4 3-3 3-0.9 3.2-0.3 3.3-1.5 2.5-2.9 5-11.4-32.2-42-1.8-4.2-0.1-4.8 1.6-4.5 24.5-42.4 1.5 5.3 4.3 5.5 3.7 1.4 0.6 3.8 2.5 26.7 2.7 2.1 12.7 0.6 0.7-0.8 8.3-9.7 3.4-2.2 8.1-0.7 7.5-4.7 4.2-2.6 1.7-0.6 1.6-0.1 2.2 1 8.4 5.3 5.3 0.4 13.5-3.8 3.8-0.1 0.2 1 1.2 3.5 3.5 6.3 4.1 5.8 4.6 4.9 4.9 4.2 2.5 1.7 2.4 2.4 1.3 3.5z" id="GTM1947" name="San Marcos"onClick={() => handleDepartmentClick(6)}/>
          </a>
          <a xlinkTitle="Alta Verapaz">
            <path d="M707.6 507.8l-6.8 9.1-2.6 2-4.7 0.5-1.5 1-1.3 2.3-0.2 0.7-3.1 5.5-0.9 1.3-0.9 0.7-2.6 1.2-4.1 2.9-1.3 0.6-2.6 0.8-1.2 1.2-0.6 1.3-15.6 22.1-13.9 19.8-1.8 4.4 0.6 0.2 1.1 0.6 1.4 1.5 0.9 1.5 5.5 5.9 2 3 2.1 2.4 3.3 3 0.9 1.4 0.3 1-2 3.3-0.8 1.9-0.7 2.8-0.6 1.2-0.7 1.1-1 0.8-4.7 2.3-1.5 1.1-0.4 0.5-2.2 30.2 0 3.8 0.2 0.9 1 2.5 0.6 1.1 1.7 2.3 1.4 2.4 0.2 1.1 0 1.3-0.8 4.3 0 2.5 0.5 1.3 1.1 2.4 4.4 6.4-17.1 4-7.9-0.5-15.8 2.4-2.9-0.6-8.7-3.4-5.7-0.2-2.6 0.4-6.8 3.1-7.3 1.9-4.1 0.3-12.2-1.4 11-15.8 2.6-7.5 0.2-2.6-0.5-1.2-0.6-1.2-1.1-1.4-2.8-2.7-1.9-1.1-1.7-0.4-11.1 0.9-2.3 0.6-8.1 3.2-9.7 0.3-27.1-3.8-11.9-2.9-3.4-0.2-1 0.8-0.9 0.9-0.8 1.8-0.2 1.6-2 7.9-1.7 2.5-1.1 1-3.1 3.8-0.9 1-2.5 1.4-1 0.1-0.7-0.2-2.7-2.6-13.6-9.3-5.4-1.7-5.8 0.2-8.4-0.2-5.6-0.1-5.8-0.3 1.6-2.2 2.4-4.3 2.3-5.9 0.2-5.2-3.9-2.3-39-6-7.8-3.1-5.1-5-1.3-3.6-0.5-4.7 1.1-4 3.3-1.7 9.9-0.9 3-1.7-2-2.7 0-1.7 7-6.3 1.4-0.7 2.6-2.8 1.7-3-1.6-1.5-1.3-2.3-1.7-5.3-2.5-5.4-3.7-2.6 2.1-4.2-0.2-3.7-2.4-3.3-4.8-3.1-0.1-1.2 0.4-0.3 1.6-0.2-2-1.3-2.3-0.4-2.3 0.4-2 1.3-3-1.7-10.5-3-9.2-1.6-1.9-2.5 0.9-2.9 3.4-2.4-1.4-0.8-3.7-2.9 0-1.6 1.2-0.4 1.1-0.9 1.2-0.6-1.6-2.3-2.4-1.3-2.9-0.3-3.2 0.4 1.5-3.7 6.8-8.6 3.3-9.1 1-1.5 6-2.4 2.6-5-1.5-4.4-6.2-0.7 2.4-8.6 1.9-3.7 2.5-1.8 0-1.7-1.3-0.3-0.1-0.7-0.5-0.8-1.7 1.8-2.2-2.5-1-0.9 0-1.9 3.3-0.8 3.9-3.3 2.8-1.2 0.6 0.8 0.8 1.7 1.2 1.1 1.7-1.1 0.9-2.1-0.4-1.4-0.1-1.1 2.2-1.4-1.8-3.6 10.5-5.7 6.4-1.4 3.6 3.6 1.7 0 0.7-2.1 1.2-0.9 1.4 0 1.7 1.1 0 1.9-2.3 1.2-1.2 0.4 0 1.9 4.2-0.2 2.5 1.5 2.2 2.1 3.2 1.8 0.8-0.9 1.6-1.4 1-1.1 0.5 1.6 0.2 0.1 0.9-1.7 1.8 1.7 0.8-0.1 0.9-1.6 1.7 0 2.6 1.2 4.8-3.1 2.9 1.9 1.5 0 0.4-1.3 0.9-1.1 0.4-1.3 3 1.1 2.6-1 1-2.4-1.5-2.8 2.1-2.9 0.5-2.4-1.2-2.1-2.9-1.5 0.1-0.1 6.7-0.7 50.6 7.8 42.1 13.6 1.7 0.2 0.4-0.3 0.3-0.9 0.7-0.7 1-0.6 2.8-0.4 1.1 0.2 0.6 0.8 0.2 0.8 0.7 0.9 0.9 0.2 1.4-0.3 1.1 0.1 0.9 1.1 0.6 0.1 1.4-0.4 2-0.4 0.6-0.5 0-0.9-0.5-2 0-0.7 1 0 1.8 0.8 0.9 0.8 0 0.6-0.4 1.4 0.3 0.6 1.2 0.9 0.1 0.5-0.6 1.8 4.2 3.2 2.8 0.6 0.6-0.2 1.1-1.2 4.3 3 2.4 0.3 1.4-0.2 0.6 0.3 0.7 1 0.9 1.6 3.2 4.4 0.6 1.5 0.4 1.3 1.2 2.3 0.9 0.8 0.8 0.3 1.6-0.3 1 0.1 3.9 0.6 8.3-0.5 1.4-0.4 1-0.8 1-1.5 0.9-0.9 1.4-0.2 2.2 0.2 0.7-0.1 2.3-1.5 1.4 0.3 5.9 2.7 0.7 0.4 3.9 3.4 5.2 3.5 1.4 0.7 1.1 0.4 3.3 0.2 1.4-0.3 1.2-0.6 2.9-2.4 1.7-0.1 15.4 2.1 0.9 0 1.4-0.4 1.1-0.7 2.6-0.7 3.4-0.2 1.6 0.1 1 0.5 0.2 0.6 0.6 13.4 0.5 0.2 6.6-3 5.3-1.1 4.2 2.3 1.9 0.2 3-1.4 7.5-1.8z" id="GTM1948" name="Alta Verapaz"onClick={() => handleDepartmentClick(4)}/>
          </a>
          <a xlinkTitle="Chimaltenango">
            <path d="M394.9 754.1l-0.7 4-0.4 1.4-0.8 1.3-1.9 1.5-2.8 1-1.2 0.7-3.8 2.9-1.2 0.6-1 0.1-0.6-0.3-1.4 0-1.6 1.1-1 0.9-1.5 2.5-2.3 7.7-4.5 7-3.9 7.1-0.7 3.2 1.4 7.4 0.8 2.4 0.8 4.6-0.1 2.7-0.7 1.3-1.5 1.8-3.3 7.2-6.2 4.6-11.2 12.5-5.4 10.3-1.3 7.1 0.2 1.8-6.6 5.2-5.2 5-1.7 2.2-0.3 0.6-1.5 3.7-4.7 9.7-1.8 0.8-1.1-1.4-0.1-0.8 0-2.1-0.5-4.1-0.7-1-0.6-0.5-0.6 0.2-1 0.8-1.3 1.4-1.6 0.7-1.8 0.2-1.3-0.6-1.5-1-2.4-2.2-1.3-0.8-1.1-0.4-2.1 0.5-3.3 1.9-2 0.7-2.3 0.2-1.1-0.1-1.1-0.6-0.7-0.6-3.4-2.6 3.5-9.5 0-3.3 0.4-5.8-0.4-2.5-0.9-1.2-1.6-1.7-1.7-1.6 2-20.4 0.1-5.7 0.7-2.4 2-2.8 5.1-12.3-0.5-5.5 0.2-0.9 1.6-5-4-19.2-0.6-1.7 6.6-3.2 1.8-1.5 5.6-15.9 1.6-2.5 0.9-0.8 2.5-1.2 4.2-1.1 4.1-2.6 4.6 0.9 16.1-0.4 2.9-0.7 3.4-0.6 3.9 0 11.8 3.5 12.8 0 4.2 0.6 7.3 2.5 8.9 1.8 3.4 1.3z" id="GTM1949" name="Chimaltenango"onClick={() => handleDepartmentClick(12)}/>
          </a>
          <a xlinkTitle="Escuintla">
            <path d="M396.6 865.7l3.2 9.6 3.6 3.2 2.1 0.7 3.2-0.1 1.4 0.4 1 3.4 1.6 13.2-0.2 8.4 0.8 3.1 3 7 1.5 5.6-3.6 3.5-1.5 2.9-0.8 2.8 0.1 1.2 0.3 0.8 1.6 0.6 3.4 0.6 1.6 0.1 2.3-0.2 3.8-1.4 1-0.1 1.1 0.2 2.2 1.1 0.6 0.9 0.2 0.7-3.1 4-4 3.8-1.6 1-0.7 0.3-4.6 0.7-1.6 0.8 0 3.5 0.9 1.7 0.5 0.5 3.5 3.4 0.5 1.1 0.1 0.8-1 1.6-1 0.8-3.3 1.9-1.2 1.2-1.9 3.6-0.7 2.6-1.4 0.7-2.7 0.4-2.8 0.8-1.1 1.1-0.5 1.2 0 31.8 0 2.8-2.7-0.4-17.1-1.7-19.2 1.9-2.9 0.8-28.3 1.8-33.1-0.6-30.2-3.3-37.4-7.4-52.5-23.4-0.3-2.4-0.8-4 0.2-1.2 0.5-1.4 12.1-17.8 2-4.5 1.2-1.9 1.3-1.3 1.5-2.1 0.3-4.1-0.6-10.3-0.9-6-0.1-2.1 0.1-3.1 0.5-1.8 0.3-0.8 2.6-1.6 2 1.4 0.8 1.2 0.7 2 0.3 0.5 0.7 0.2 1-0.2 1.8-1.1 0.8-0.7 0.5-0.8-0.3-1.2-1.2-2.3-0.5-1.3-0.4-2.2-0.2-1.6 0.1-1.6 0.5-2.2 0.9-1.7 0.9-0.9 7-5.2 1.2-0.7 2-0.6 1 0.4 1.1 0.8 1.6 2.5 0.4 1.3 0 1-1.8 2.6-0.4 1.3 0 0.7 0.6 1.3 1.2 1.6 0.3 1.7-0.5 2.1 0 1.5 0.7 1.5 1.1 1.1 2.2 1.1 1.6 0.3 2.5-0.1 2-1.2 4.5-5 2.7 2.6-1.2 6.2 1.5 0.4 29 2.1 1.5-1 2.2-4.3 1.1-1.7 0.4-1 0.2-1.4 0.7-12.3 1.7-4.4 7-14.5 3.4 2.6 0.7 0.6 1.1 0.6 1.1 0.1 2.3-0.2 2-0.7 3.3-1.9 2.1-0.5 1.1 0.4 1.3 0.8 2.4 2.2 1.5 1 1.3 0.6 1.8-0.2 1.6-0.7 1.3-1.4 1-0.8 0.6-0.2 0.6 0.5 0.7 1 0.5 4.1 0 2.1 0.1 0.8 1.1 1.4 1.8-0.8 4.7-9.7 1.5-3.7 0.3-0.6 1.7-2.2 5.2-5 6.6-5.2 7.3 6.3 2 2.2 0.4 1.3 1.9 4 3.1 5.2 1.6 1.8 1.2 0.8 6.5-5.7 2.1-2.4 1.2-2.3 1.1-1.5 1.1-0.8 2.1-1.3 3.6 0 1.5-0.8 1.2-1.9 1.6-0.5 1 0.7 0.4 0.5 2.7 6 15.9-6.4z" id="GTM1950" name="Escuintla"onClick={() => handleDepartmentClick(15)}/>
          </a>
          <a xlinkTitle="Guatemala">
            <path d="M458.8 755.4l-3.1 5.5-1.3 1.7 0 1 0.2 1.4 0.8 1.4 1 0.8 0.7 0.2 1.5 0.2 1.6-0.1 3.4-1 5.7-0.4 1.8 0.6 0.4 0.6 1.1 2.3 2.3 6.4 0.9 6.3-0.3 2.1-1.7 2.2-1 1.8-0.3 1.2 0.1 1.1 1.3 2.7 5.2 5.5 2.3 1.8 14.5 5.3 3.3 1.7 1.5 1.3 2.7 3.1 2.7 0.9-2.3 5.8-1.1 1.8-2.6 1.8-8.1 6.7-1.4 6.1-0.1 4-0.7 2.1-0.6 1.2-1 0.8-0.6 2.8-0.4 8-3 1.4-2.1 0-2.1 0.7-1.4 1.5-4.7 4.3-1.6 1-1.1 0.3-0.4-0.5-0.5-1.2-0.4-3.1-1.2-1.4-1.8-0.5-1 0.1-4.3 1.9-10.1 16.2-4.6 11.6 1.3 12-0.3 3.2-1.3 1.5-0.9 0.7-1.3 0.6-1.5 1.1-2.1 2.5-1 0.6-1.5 0.3-2 0.7-4.8 2.3-4.7 4.4-1.9 1.3-7.1 2.6-1.5-5.6-3-7-0.8-3.1 0.2-8.4-1.6-13.2-1-3.4-1.4-0.4-3.2 0.1-2.1-0.7-3.6-3.2-3.2-9.6 2.2-9.6 1.8-20.6 1.3-3.1 2-2.3-0.5-3 1.4-4.7-0.1-1.9-0.4-0.6-5.7-6.6-2.2-7.4-7.5-9.6-2.5-2.4-1.4-0.2-3.1 0.6-2.3-0.1-2.4-0.5-3.2-2-5.8-5.2 4.5-7 2.3-7.7 1.5-2.5 1-0.9 1.6-1.1 1.4 0 0.6 0.3 1-0.1 1.2-0.6 3.8-2.9 1.2-0.7 2.8-1 1.9-1.5 0.8-1.3 0.4-1.4 0.7-4 8.8 3.2 3.7-0.7 1.9 2.2 1.3 0.5 1.1-0.3 1.1-0.6 1.5 0 3.8 0.6 6.2-1.3 6.3-2.3 4-2.3 1.9 0 1.2 2.4 1.8 1.1 2.4 0.3 2.9-0.3 3.3-0.8 1-1.3 0.6-1.5 2-1.5 4-0.8 2 1.7 1.1 3z" id="GTM1951" name="Guatemala" onClick={() => handleDepartmentClick(14)}/>
          </a>
          <a xlinkTitle="Suchitepéquez">
            <path d="M281.7 849.9l1.7 1.6 1.6 1.7 0.9 1.2 0.4 2.5-0.4 5.8 0 3.3-3.5 9.5-7 14.5-1.7 4.4-0.7 12.3-0.2 1.4-0.4 1-1.1 1.7-2.2 4.3-1.5 1-29-2.1-1.5-0.4 1.2-6.2-2.7-2.6-4.5 5-2 1.2-2.5 0.1-1.6-0.3-2.2-1.1-1.1-1.1-0.7-1.5 0-1.5 0.5-2.1-0.3-1.7-1.2-1.6-0.6-1.3 0-0.7 0.4-1.3 1.8-2.6 0-1-0.4-1.3-1.6-2.5-1.1-0.8-1-0.4-2 0.6-1.2 0.7-7 5.2-0.9 0.9-0.9 1.7-0.5 2.2-0.1 1.6 0.2 1.6 0.4 2.2 0.5 1.3 1.2 2.3 0.3 1.2-0.5 0.8-0.8 0.7-1.8 1.1-1 0.2-0.7-0.2-0.3-0.5-0.7-2-0.8-1.2-2-1.4-2.6 1.6-0.3 0.8-0.5 1.8-0.1 3.1 0.1 2.1 0.9 6 0.6 10.3-0.3 4.1-1.5 2.1-1.3 1.3-1.2 1.9-2 4.5-12.1 17.8-0.5 1.4-0.2 1.2 0.8 4 0.3 2.4-5.8-2.6-21.2-12.1-5.3-3.3-0.2-2.1-1.5-10.2 7.1-10.5 0.3-0.6 0.3-1.6 0.5-8.4 1.1-7.7 3.1-9.4 2.8-4.2 0.4-2.9-0.2-3.4 1.1-16.6-0.1-1.9-3.1-5.6-0.9-2.7-0.2-1.5 2-15-0.2-1.6 0.1-1.6 9.8-20.1-0.3-5.8 0.1-2.9 0.2-0.7 0.8-1.6 0.6-1 5.7-6.3 7.4-6.7 10.1-6.8 1.2 1.5 0.7 1.2 3.1 8.2 0.4 2.3-1.2 3.6-5.9 11.3 3.7 3.5 11.3 1.6 3.3 0.9 1.2-3.5 0.2-2-0.1-3.2 0-0.7 0.6-1.5 0.7-0.7 2.1-1.3 1.5-0.5 1.9 0.2 3.7 1.7 2.8 3.4 0.2 0.1 5.6-0.4 2.8-0.7 1.7 0.4 2.5 2.8 7.2 6.4 1.2 1.4 0.4 1.1 0.4 2 0.1 2.4-0.7 3.7 0.1 1.5 1.5 0.9 5.5-0.8 6.9-3.6 2.2-0.3 2.6 0 1.4 0.3 2.4 0.9 3.3 2.1 9.7 7.4z" id="GTM1952" name="Suchitepéquez"onClick={() => handleDepartmentClick(11)}/>
          </a>
          <a xlinkTitle="Sacatepéquez">
            <path d="M396.6 865.7l-15.9 6.4-2.7-6-0.4-0.5-1-0.7-1.6 0.5-1.2 1.9-1.5 0.8-3.6 0-2.1 1.3-1.1 0.8-1.1 1.5-1.2 2.3-2.1 2.4-6.5 5.7-1.2-0.8-1.6-1.8-3.1-5.2-1.9-4-0.4-1.3-2-2.2-7.3-6.3-0.2-1.8 1.3-7.1 5.4-10.3 11.2-12.5 6.2-4.6 3.3-7.2 1.5-1.8 0.7-1.3 0.1-2.7-0.8-4.6-0.8-2.4-1.4-7.4 0.7-3.2 3.9-7.1 5.8 5.2 3.2 2 2.4 0.5 2.3 0.1 3.1-0.6 1.4 0.2 2.5 2.4 7.5 9.6 2.2 7.4 5.7 6.6 0.4 0.6 0.1 1.9-1.4 4.7 0.5 3-2 2.3-1.3 3.1-1.8 20.6-2.2 9.6z" id="GTM1953" name="Sacatepéquez"onClick={() => handleDepartmentClick(13)}/>
          </a>
          <a xlinkTitle="Sololá">
            <path d="M288.3 774l0.6 1.7 4 19.2-1.6 5-0.2 0.9 0.5 5.5-5.1 12.3-2 2.8-0.7 2.4-0.1 5.7-2 20.4-9.7-7.4-3.3-2.1-2.4-0.9-1.4-0.3-2.6 0-2.2 0.3-6.9 3.6-5.5 0.8-1.5-0.9-0.1-1.5 0.7-3.7-0.1-2.4-0.4-2-0.4-1.1-1.2-1.4-7.2-6.4-2.5-2.8-1.7-0.4-2.8 0.7-5.6 0.4-0.2-0.1-2.8-3.4-3.7-1.7-1.9-0.2-1.5 0.5-2.1 1.3-0.7 0.7-0.6 1.5 0 0.7 0.1 3.2-0.2 2-1.2 3.5-3.3-0.9-11.3-1.6-3.7-3.5 5.9-11.3 1.2-3.6-0.4-2.3-3.1-8.2-0.7-1.2-1.2-1.5 7.3-10 3-10 1-0.9 11.3-9.7 2.2-0.7 2.9-0.5 5.7 0.9 2.3 0.7 1.4 0.6 1.8 0.2 5.1-2.2 3.4 0 1.7 0.3 4 1.4 2.4 0.1 1.3-0.3 2.8-0.8 3.4-3.4 3.3-4.8 4.8-4.8 3 1.4 1.3 3.4 2.3 4.3 1.6 1.1 2.4 0.3 1.4 0.4 2.9 1.1 1.1 0.8 0.5 0.9-0.2 0.6-1.4 2.3-2 2.3-0.6 1.5 0 1.4 0.4 2.8 0.5 1.2 0.7 0.7 1.4 0 1.2-0.5 1-1.6 1-3.5 1.1-0.7 4.1 1.4z" id="GTM1954" name="Sololá"onClick={() => handleDepartmentClick(9)}/>
          </a>
          <a xlinkTitle="Totonicapán">
            <path d="M231.8 661.8l-1.2 7.2 0 4.6 1.2 4 3.4 1.7 0.8 1.8 6.9 7.1 1.7 0.7 1.2 5.1 2.4 3.4 0.4 3.6 1.7 0.6 1.5 2.9 0 1.3-0.2 2.6-0.6 1-0.7 0.5-2.6 0.1-1 0.3-1.3 0.5-2 1.6-0.8 1.2-0.6 1.7-0.2 2 0.1 1.5 0.8 1.1 2.6 1.7 4.4 3.4 1.2 2 1.2 4.6 1.7 2.8 4.1 2.9 0.7 1.4 0.1 1.6-1.9 5.9 7.8 6.2-4.8 4.8-3.3 4.8-3.4 3.4-2.8 0.8-1.3 0.3-2.4-0.1-4-1.4-1.7-0.3-3.4 0-5.1 2.2-1.8-0.2-1.4-0.6-2.3-0.7-5.7-0.9-2.9 0.5-2.2 0.7-11.3 9.7-1 0.9-4.9-8.6-2.7-2.5-0.7-7.7-2.2-5-5.2 0.2-4.8 0.6-1.7-0.6-0.7-1-3.9-4.7-0.5-1.7 0-1.6 0.5-1.4 0.1-3-4.2-3.8-1.8-2.4-7.1-27.2-1.3-7.4 0.5-2.1 1.1-0.6 12.7-5 4.3-1.4 8.4-0.5 2-1 0.2-0.8 0.5-6.5 0.2-0.7 1.5-2.9 3.2-4.8 0.9-0.9 1.3-0.7 2.4-0.7 10.8-2.5 3.8-2.8 6-2.7 2.9-0.5 6.4 0.4z" id="GTM1955" name="Totonicapán"onClick={() => handleDepartmentClick(8)}/>
          </a>
          <a xlinkTitle="El Progreso">
            <path d="M599.1 761.2l-3.9-0.3-3.2 0.1-1.4 0.3-1.4 0.6-3.4 3-8.7 10.9-7.2 4-7.5 2.7-8.3 1-5.7 1.8-7.8 14.4-0.9 1-1.2 0.6-1.9-0.7-3.1-1.5-3.7-0.4-8.4 2.8-6.5 2.5-1 0.7-0.4 0.7-0.3 1.7-1 2.7-3.9 2.3-2.2 0.9-2.7-0.9-2.7-3.1-1.5-1.3-3.3-1.7-14.5-5.3-2.3-1.8-5.2-5.5-1.3-2.7-0.1-1.1 0.3-1.2 1-1.8 1.7-2.2 0.3-2.1-0.9-6.3-2.3-6.4-1.1-2.3-0.4-0.6-1.8-0.6-5.7 0.4-3.4 1-1.6 0.1-1.5-0.2-0.7-0.2-1-0.8-0.8-1.4-0.2-1.4 0-1 1.3-1.7 3.1-5.5 3.1 3 8.2 1.5 12.6-2.1 1.2-4.1 4-12.6 39.3-27.4 21.2-14.3 9.5-6.5 6.7-3.7 12.2 1.4 4.1-0.3 7.3-1.9 9.1 13.2 11.1 16.7 0.2 3.5-12 0.2-1.2 0.2-1 0.4 0.3 1 0.6 1.2 10.9 15.1 2 2.8 3 1.6 3.2 0.5 1.3 0.8 0.6 0.8-0.5 5.1-0.5 1.2-1 0.4-1.2 0.2-5.4 0.2-3.1 1.3-5.5 6.4z" id="GTM1956" name="El Progreso"onClick={() => handleDepartmentClick(20)}/>
          </a>
          <a xlinkTitle="Santa Rosa">
            <path d="M545 874.8l-4.4 14.1-3.5 0.4 0.7 4.8-0.2 0.8-0.6 0.3-1.2-0.5-1.2-0.6-2.8-0.1-8.6 1.7-3.8 3.3-8.9 22 3.6 2.6 11.5 3.3 1.4 0.6 1 0.7 1.7 1.8 7.7 6.4 6.1 5.9 1.2 2.6-0.4 5.6 1.1 10.1-0.3 2.3-0.7 2.2-1.3 2.8-4.3 6.2-1.4 1.6-0.6 0.2-3.3 0.6-2.9 0.8-2.2 1.5-1.6 2.9-3.9 7.3-3.8 2.7-1.9 0.2-2.5-1-9.7-2.4-1.3-0.5-4.8-4-6.9-4.1-4.5 1.3-1.5 1.1-0.4 0.9-0.3 1.5 0.2 2.3 0.9 1.8 0.8 1 1.2 1.3 0.4 1.1 1.8 10.5 0.3 0.7 0.9 0.8 1.3 0.6 0.7 1.2 0.9 2 2.4 9 3.2 5.8 0.4 1.3 0.2 1.2-0.1 4.6-2.5 9.8-1.3-0.5-38.5-17.3-24.6-9.3-19.9-4.7-11.6-1.9 0-2.8 0-31.8 0.5-1.2 1.1-1.1 2.8-0.8 2.7-0.4 1.4-0.7 0.7-2.6 1.9-3.6 1.2-1.2 3.3-1.9 1-0.8 1-1.6-0.1-0.8-0.5-1.1-3.5-3.4-0.5-0.5-0.9-1.7 0-3.5 1.6-0.8 4.6-0.7 0.7-0.3 1.6-1 4-3.8 3.1-4-0.2-0.7-0.6-0.9-2.2-1.1-1.1-0.2-1 0.1-3.8 1.4-2.3 0.2-1.6-0.1-3.4-0.6-1.6-0.6-0.3-0.8-0.1-1.2 0.8-2.8 1.5-2.9 3.6-3.5 7.1-2.6 1.9-1.3 4.7-4.4 4.8-2.3 2-0.7 1.5-0.3 1-0.6 2.1-2.5 1.5-1.1 1.3-0.6 0.9-0.7 1.3-1.5 0.3-3.2-1.3-12 4.6-11.6 10.1-16.2 4.3-1.9 1-0.1 1.8 0.5 1.2 1.4 0.4 3.1 0.5 1.2 0.4 0.5 1.1-0.3 1.6-1 4.7-4.3 1.4-1.5 2.1-0.7 2.1 0 3-1.4 3.1 3.3 0.5 0.7 1.5 1 3.4-0.5 30.5-5.8 1.2 6.1 2.3 3.5 8.8 7.3 6.5 5.1z" id="GTM1957" name="Santa Rosa"onClick={() => handleDepartmentClick(16)}/>
          </a>
          <a xlinkTitle="Izabal">
            <path d="M769.4 711.1l-0.8-0.6-1.8-0.8-1.1-0.8-4.8-5.8-0.5-1.5-1.5-7.2-0.3-4 0.1-2.5-0.1-1.6-1.9-8.2 0-1.7 0.2-1 3.2-1.3 1-0.7 0.8-0.9 0.9-1.7 0.3-1.7 0.5-6.5-0.1-1.6-0.2-0.7-1-1.7-1.2-1.3-1.5-1.2-5.8-3.2-2.5-0.6-7.6-0.7-5.7 1.2-3.6 1.8-6.5 4.9-29 11.8-29.4 9.9-3.7 0.8-10.1 1.2-4.4-6.4-1.1-2.4-0.5-1.3 0-2.5 0.8-4.3 0-1.3-0.2-1.1-1.4-2.4-1.7-2.3-0.6-1.1-1-2.5-0.2-0.9 0-3.8 2.2-30.2 0.4-0.5 1.5-1.1 4.7-2.3 1-0.8 0.7-1.1 0.6-1.2 0.7-2.8 0.8-1.9 2-3.3-0.3-1-0.9-1.4-3.3-3-2.1-2.4-2-3-5.5-5.9-0.9-1.5-1.4-1.5-1.1-0.6-0.6-0.2 1.8-4.4 13.9-19.8 15.6-22.1 0.6-1.3 1.2-1.2 2.6-0.8 1.3-0.6 4.1-2.9 2.6-1.2 0.9-0.7 0.9-1.3 3.1-5.5 0.2-0.7 1.3-2.3 1.5-1 4.7-0.5 2.6-2 6.8-9.1 2.9-1.8 1-0.9 0.7-1.7 0.4-1.8 1.6-4.3 2.9-2.9 22.8-0.4 5.8 0.8 1.6 1.3-0.1 3.2 2.1 3.4 0.5-0.8 2.4-1.2 2.9-1 2.2-0.1 4.5-1.9 19 0.9 7.1-1.2 7.9-0.1 22 5.7 9.4-3.7 3.4 1.6 8.4 7.1 8.6-2.1 11 2.4 8.4 5 0.9 5.4 5.7 0.9 25 15.8-3.1 11.7 0.5 1.7 6.7 0 2.7-1 0.8-2.2-0.3-2-0.6-0.2 0-1.1-0.9-0.9-0.8-1.2 0.1-2 1.2-0.4 2.3 0.3 2.2-0.4 1-2.3 1-4.1 2.2-2.8 2.3-2.2 1.4-2.3 0.3-4-1.9-6.1-0.2-4 1.8 0 0 2.7 0 0.8 1.6 0 2.9-1.9 7.3 1.4 3.5-1.4-5.8-5.4-3.1-2.4-4.6-2.1-1.9-2.6-1.7-2.9-1.7-2.2-10.7-6.1-3-3.8 3.6-4.2 3.7 2.2 7.1 3.1 2.8 1.7 7.2 7.7 5.3 3 12.9 10.9 25.6 12.1 8.4 7.6 2.6 1.2 10.9 9.6 8.8 3.8-2.9 1.1-0.8 2.3 0.2 2.8-1.6 3.5-1.6-2-4.2 1.9-3.7 2-3.9 1.5-5.2 0.1-1.4 1.9-7.5 12.9-11.5 11.4-25.1 19.8-43.2 33.7-42.8 33.4-31.4 24.4-8.6 4.1-25.2 8.4-7.6 3.9-1.6 1.3z" id="GTM1959" name="Izabal"onClick={() => handleDepartmentClick(22)}/>
          </a>
          <a xlinkTitle="Chiquimula">
            <path d="M758.9 751.8l-2.3 3.4-6.2 5.3-1.9 3-0.3 4.8 1.2 3.6 2.2 3.3 5 6.1 2.3 3.9 4.7 11.3 2.7 3.5 2.2 2 1.5 2.3 0.5 4.4-0.7 2-2.6 2.9-0.9 1.6 1.1 12.9-0.2 4.5-1.1 4.3-2.9 2.8-2.9 0.2-6.2-2.2-3.1-0.5-4.2 0.5-1.9 1.3-1.2 2-2.2 2.8-7.8 6.7-3.4 3.8-2.5 4.5-2.1 2.1-5.5 1.4-2.5 1.7-1.6 3.4-0.5 4 0.6 8-7.2-5.3-0.3 0.6-1.3 2-0.3-5-2.5 1-5.6 5.9-3.9 0.8-2.8-1.1-2.8-1.5-4-0.5-2.7 1.2-3.3-4-0.5-0.9 0.1-2.3 0.7-2.9 0.8-2.5 0.7-1.6 1.2-3.6 0.2-1.3 0.1-1.2-0.7-1.7-3.5-3.9-1.5-0.5-18.7 0.7-0.9-0.2-0.8-0.6-2.9-4.2-1.2-2.4-1.4-2-2.2-2.4-3.1-1-10-1.2-2.7 0.1-0.8-0.1 0.9-5.4 8.9-24.9-1-3-0.9-2.1-0.3-1.4 0.1-1.5 0.3-1.5 0.5-3.1 0.1-0.9-0.5-2.9-1-2.8-1.3-2-3.2-1-11.7 0.7 5.8-10.7 1.1-4.2-0.8-6.3 0.3-1.3 5.7-5.4 4.2-3.3 2.9 0.4 8.5 4.4 7.9 3.9 3.7 0.8 13.2 0.3 3.8-0.9 15-12.1 4.8-1.4 2 0 5.5 1.7 3.4 2.3 4 0 12.3-4.1 3.8 1.2 1 1.3 1.6 1.1 1.9-0.1 2.9-1 1.6-1.2 1.1-1.3 1.3-2 1-0.9 1.7-1.2 5.4-2.8 1.9-0.5 1.3-0.2 0.7 0.2 0.9 0.8 0.8 1 0.9 1.8 0.7 1.8 1 1.7 0.8 2z" id="GTM1960" name="Chiquimula"onClick={() => handleDepartmentClick(19)}/>
          </a>
          <a xlinkTitle="Jalapa">
            <path d="M599.1 761.2l-1.9 4.2 0.7 1 1.4 2.6 2.3 3.3 4 7.6 2 2.9 1.5 1.7 0.8 0.1 6.6 0 4 0.6 2.8 0.8 11.7-0.7 3.2 1 1.3 2 1 2.8 0.5 2.9-0.1 0.9-0.5 3.1-0.3 1.5-0.1 1.5 0.3 1.4 0.9 2.1 1 3-8.9 24.9-0.9 5.4 0.8 0.1 2.7-0.1 1.9 5.8 0 2.5-0.2 0.8-5.3 3.2-15.5 7.5-0.5-0.2-2.7-2.2-1.7-1.7-0.8-1-0.9-0.8-1.8-0.3-4.8 1.3-4.1 2.8-4.7 3.1-5.1 3.5-2 3.1-1.3 8.8-11.1-8.7-1.4-0.6-1.8-0.3-1.1 0.1-1.7 0.4-1.6 0.7-1.1 1.1-5.9 7.9-15.7 0.2-6.5-5.1-8.8-7.3-2.3-3.5-1.2-6.1-30.5 5.8-3.4 0.5-1.5-1-0.5-0.7-3.1-3.3 0.4-8 0.6-2.8 1-0.8 0.6-1.2 0.7-2.1 0.1-4 1.4-6.1 8.1-6.7 2.6-1.8 1.1-1.8 2.3-5.8 2.2-0.9 3.9-2.3 1-2.7 0.3-1.7 0.4-0.7 1-0.7 6.5-2.5 8.4-2.8 3.7 0.4 3.1 1.5 1.9 0.7 1.2-0.6 0.9-1 7.8-14.4 5.7-1.8 8.3-1 7.5-2.7 7.2-4 8.7-10.9 3.4-3 1.4-0.6 1.4-0.3 3.2-0.1 3.9 0.3z" id="GTM1961" name="Jalapa"onClick={() => handleDepartmentClick(18)}/>
          </a>
          <a xlinkTitle="Jutiapa">
            <path d="M682.8 877.5l-1.7 0.7-6.1 7.4-3.4 2.5-0.7-4.8-2.7-2.7-3.6-0.3-3.6 2.6-1.6 4 1.1 2.9 1.8 2.6 0.7 2.9-1.6 2.6-2.4 1.7-1.5 2.2 1.5 3.6 5.2 0.7 1.7 0.8 1.5 1.3 0.7 1 1.4 2.8 0.3 1.2 0.5 3.9 0.4 1.6 1.1 1.1 3.2 1.6 0.8 1 0 4-1.6 1.6-26.6 6.4-6.5 3-6.3 4.8-5 5.5-10.6 18.8-0.7 2.1 0.3 1.9 1.8 4.2-0.1 1.4-3.6 1.9-3.7-1.4-6.4-5.1-4.5-1.1-3.7 0.2-11 4.2-2.6 1.7-5.3 5.3-23.8 16.8-3.7 3.2-2.1 3.6-1.6 3.7-2.3 3.6-3.1 2.5-6.8 3.6-2.9 3.1-2 3.7-1.3 4-0.6 4.2 0.1 4 5.3 17.2-1.4-0.6-35.2-14.7 2.5-9.8 0.1-4.6-0.2-1.2-0.4-1.3-3.2-5.8-2.4-9-0.9-2-0.7-1.2-1.3-0.6-0.9-0.8-0.3-0.7-1.8-10.5-0.4-1.1-1.2-1.3-0.8-1-0.9-1.8-0.2-2.3 0.3-1.5 0.4-0.9 1.5-1.1 4.5-1.3 6.9 4.1 4.8 4 1.3 0.5 9.7 2.4 2.5 1 1.9-0.2 3.8-2.7 3.9-7.3 1.6-2.9 2.2-1.5 2.9-0.8 3.3-0.6 0.6-0.2 1.4-1.6 4.3-6.2 1.3-2.8 0.7-2.2 0.3-2.3-1.1-10.1 0.4-5.6-1.2-2.6-6.1-5.9-7.7-6.4-1.7-1.8-1-0.7-1.4-0.6-11.5-3.3-3.6-2.6 8.9-22 3.8-3.3 8.6-1.7 2.8 0.1 1.2 0.6 1.2 0.5 0.6-0.3 0.2-0.8-0.7-4.8 3.5-0.4 4.4-14.1 15.7-0.2 5.9-7.9 1.1-1.1 1.6-0.7 1.7-0.4 1.1-0.1 1.8 0.3 1.4 0.6 11.1 8.7 1.3-8.8 2-3.1 5.1-3.5 4.7-3.1 4.1-2.8 4.8-1.3 1.8 0.3 0.9 0.8 0.8 1 1.7 1.7 2.7 2.2 0.5 0.2 15.5-7.5 5.3-3.2 0.2-0.8 0-2.5-1.9-5.8 10 1.2 3.1 1 2.2 2.4 1.4 2 1.2 2.4 2.9 4.2 0.8 0.6 0.9 0.2 18.7-0.7 1.5 0.5 3.5 3.9 0.7 1.7-0.1 1.2-0.2 1.3-1.2 3.6-0.7 1.6-0.8 2.5-0.7 2.9-0.1 2.3 0.5 0.9 3.3 4z" id="GTM1962" name="Jutiapa"onClick={() => handleDepartmentClick(17)}/>
          </a>
          <a xlinkTitle="Zacapa">
            <path d="M769.4 711.1l-3.4 2.9-3 4.6-3.9 11.8 4.8 4.6 0 6.8-3.1 7.2-1.9 2.8-0.8-2-1-1.7-0.7-1.8-0.9-1.8-0.8-1-0.9-0.8-0.7-0.2-1.3 0.2-1.9 0.5-5.4 2.8-1.7 1.2-1 0.9-1.3 2-1.1 1.3-1.6 1.2-2.9 1-1.9 0.1-1.6-1.1-1-1.3-3.8-1.2-12.3 4.1-4 0-3.4-2.3-5.5-1.7-2 0-4.8 1.4-15 12.1-3.8 0.9-13.2-0.3-3.7-0.8-7.9-3.9-8.5-4.4-2.9-0.4-4.2 3.3-5.7 5.4-0.3 1.3 0.8 6.3-1.1 4.2-5.8 10.7-2.8-0.8-4-0.6-6.6 0-0.8-0.1-1.5-1.7-2-2.9-4-7.6-2.3-3.3-1.4-2.6-0.7-1 1.9-4.2 5.5-6.4 3.1-1.3 5.4-0.2 1.2-0.2 1-0.4 0.5-1.2 0.5-5.1-0.6-0.8-1.3-0.8-3.2-0.5-3-1.6-2-2.8-10.9-15.1-0.6-1.2-0.3-1 1-0.4 1.2-0.2 12-0.2-0.2-3.5-11.1-16.7-9.1-13.2 6.8-3.1 2.6-0.4 5.7 0.2 8.7 3.4 2.9 0.6 15.8-2.4 7.9 0.5 17.1-4 10.1-1.2 3.7-0.8 29.4-9.9 29-11.8 6.5-4.9 3.6-1.8 5.7-1.2 7.6 0.7 2.5 0.6 5.8 3.2 1.5 1.2 1.2 1.3 1 1.7 0.2 0.7 0.1 1.6-0.5 6.5-0.3 1.7-0.9 1.7-0.8 0.9-1 0.7-3.2 1.3-0.2 1 0 1.7 1.9 8.2 0.1 1.6-0.1 2.5 0.3 4 1.5 7.2 0.5 1.5 4.8 5.8 1.1 0.8 1.8 0.8 0.8 0.6z" id="GTM1963" name="Zacapa"onClick={() => handleDepartmentClick(21)}/>
          </a>
          <a xlinkTitle="Quiché">
            <path d="M433 662l-9.3 12.8-8.2 0.7-29-1.3-41.2-9.7-2-1.1-1.6 27.9 18.5 24 22.4 14.1-0.2 1.2-1.1 5.6 4.5 4.6 1.7 1.5 1.6 1.1 1.8 1.7 1.1 2.4 2.9 6.6-3.4-1.3-8.9-1.8-7.3-2.5-4.2-0.6-12.8 0-11.8-3.5-3.9 0-3.4 0.6-2.9 0.7-16.1 0.4-4.6-0.9-4.1 2.6-4.2 1.1-2.5 1.2-0.9 0.8-1.6 2.5-5.6 15.9-1.8 1.5-6.6 3.2-4.1-1.4-1.1 0.7-1 3.5-1 1.6-1.2 0.5-1.4 0-0.7-0.7-0.5-1.2-0.4-2.8 0-1.4 0.6-1.5 2-2.3 1.4-2.3 0.2-0.6-0.5-0.9-1.1-0.8-2.9-1.1-1.4-0.4-2.4-0.3-1.6-1.1-2.3-4.3-1.3-3.4-3-1.4-7.8-6.2 1.9-5.9-0.1-1.6-0.7-1.4-4.1-2.9-1.7-2.8-1.2-4.6-1.2-2-4.4-3.4-2.6-1.7-0.8-1.1-0.1-1.5 0.2-2 0.6-1.7 0.8-1.2 2-1.6 1.3-0.5 1-0.3 2.6-0.1 0.7-0.5 0.6-1 0.2-2.6 0-1.3-1.5-2.9-1.7-0.6-0.4-3.6-2.4-3.4-1.2-5.1-1.7-0.7-6.9-7.1-0.8-1.8-3.4-1.7-1.2-4 0-4.6 1.2-7.2 1.1-2.2 2-1.3 10.7-2 5.7-1.9 2.2-0.1 6.1 1.1 2.2-0.2 3.8-0.9-1.2-5.1-1.5-3.9-0.2-1.4 2.1-9.3-0.5-4.6-6.9-3.2-3.1-0.7-7.3 0.9-1.4 0-1-0.2-4.6-4.4-1.6-1.7-1.4-2.3-1-2.4-0.3-1.5 0-3.3-0.6-1.5-5-6.1-0.8-1.1-1.1-2.3-0.4-1.4-0.2-2.4 0.3-1.5 0.5-1.2 1.4-2.3 0.3-6 0.8-2.4 0.8-1.2 1.5-2.9 0.6-2.5 0.4-3.1 0.6-1 0.7-0.5 0.7 0.1 2-0.5 3.1-2.7 0.5-0.3 1.5-0.3 1.5 0 0.9-0.1 6.7-4.8 1-1.4 1-0.2 2.1-0.2 0.9-0.4 0.5-0.4-0.5-1.1-0.3-1.7 4.6-4.5 0.6-0.8 16.2-33.1 2.4-4.7 30.4-60.8 35.6 0 34.2-0.1 34.1-0.1 22.3 0 4.8-0.6 4.5-1.6 2.9 1.5 1.2 2.1-0.5 2.4-2.1 2.9 1.5 2.8-1 2.4-2.6 1-3-1.1-0.4 1.3-0.9 1.1-0.4 1.3-1.5 0-2.9-1.9-4.8 3.1-2.6-1.2-1.7 0-0.9 1.6-0.8 0.1-1.8-1.7-0.9 1.7-0.2-0.1-0.5-1.6-1 1.1-1.6 1.4-0.8 0.9-3.2-1.8-2.2-2.1-2.5-1.5-4.2 0.2 0-1.9 1.2-0.4 2.3-1.2 0-1.9-1.7-1.1-1.4 0-1.2 0.9-0.7 2.1-1.7 0-3.6-3.6-6.4 1.4-10.5 5.7 1.8 3.6-2.2 1.4 0.1 1.1 0.4 1.4-0.9 2.1-1.7 1.1-1.2-1.1-0.8-1.7-0.6-0.8-2.8 1.2-3.9 3.3-3.3 0.8 0 1.9 1 0.9 2.2 2.5 1.7-1.8 0.5 0.8 0.1 0.7 1.3 0.3 0 1.7-2.5 1.8-1.9 3.7-2.4 8.6 6.2 0.7 1.5 4.4-2.6 5-6 2.4-1 1.5-3.3 9.1-6.8 8.6-1.5 3.7 3.2-0.4 2.9 0.3 2.4 1.3 1.6 2.3-1.2 0.6-1.1 0.9-1.2 0.4 0 1.6 3.7 2.9 1.4 0.8-3.4 2.4-0.9 2.9 1.9 2.5 9.2 1.6 10.5 3 3 1.7 2-1.3 2.3-0.4 2.3 0.4 2 1.3-1.6 0.2-0.4 0.3 0.1 1.2 4.8 3.1 2.4 3.3 0.2 3.7-2.1 4.2 3.7 2.6 2.5 5.4 1.7 5.3 1.3 2.3 1.6 1.5-1.7 3-2.6 2.8-1.4 0.7-7 6.3 0 1.7 2 2.7-3 1.7-9.9 0.9-3.3 1.7-1.1 4 0.5 4.7 1.3 3.6 5.1 5 7.8 3.1 39 6 3.9 2.3-0.2 5.2-2.3 5.9-2.4 4.3-1.6 2.2z" id="GTM3467" name="Quiché"onClick={() => handleDepartmentClick(3)}/>
          </a>
          <circle cx="462.9" cy="951.6" id="0"/>
          <circle cx="673.6" cy="716.6" id="1"/>
          <circle cx="855.4" cy="532.1" id="2"/>
          
        </svg>
        
        {selectedDept && selectedDept.places && selectedDept.places.length > 0 &&(
            <div className='my-box'>
                <Link to={`/MainPage/recommendation/${selectedDept.places[randomPlaceIndex]?.id_places || ''}`}>
                  <h6>{selectedDept.places[randomPlaceIndex]?.name || ''}</h6>
                </Link>
                <p>{selectedDept.places[randomPlaceIndex]?.description || ''}</p>
                <img className='imag' src={selectedDept.places[randomPlaceIndex]?.image} alt={selectedDept.places[randomPlaceIndex]?.name} />
            </div>
  )}
        <img className="jagui-mapa" src={jaguiImage} alt="Jagui Mapa"/>
        
      </div>
      </div>
    </div>
  )
}

export default Map