"use client";

import { AdvocatesType } from "@/db/schema";
import { ChangeEvent, useEffect, useState } from "react";
import Fuse from "fuse.js";

export default function Home() {
  const [advocates, setAdvocates] = useState<Array<AdvocatesType>>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Array<AdvocatesType>>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = searchTerm;
    } else {
      console.error("Element with id 'search-term' not found");
    }

    const filteredAdvocates = new Fuse(advocates, {
      keys: [
        "firstName",
        "lastName",
        "city",
        "degree",
        "specialties",
        "yearsOfExperience",
        "phoneNumber",
      ],
      includeScore: true,
      threshold: 0.3,
    }).search(searchTerm).map((result) => {
      return result.item;
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="m-6">
      <h1 className="pb">Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input className="border border-black" onChange={onChange} />
        <button className="" onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, i) => {
            return (
              <tr key={i}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
