import React from "react";
import { AdvocatesType } from "@/db/schema";
import { parsePhoneNumber } from "libphonenumber-js/min";


export default function AdvocateTable({items, isLoading}: {items: AdvocatesType[], isLoading: boolean}) {
    return (
        <table className="min-w-full border-separate border-spacing-0">
            <thead>
                <tr>
                    {["First Name", "Last Name", "City", "Degree", "Specialties", "Years of Experience", "Phone Number"].map((header, i) => (
                    <th
                        key={i}
                        className="sticky top-0 text-left text-teal-800 z-10 border-b border-teal-800/50 bg-white/90 py-3.5 backdrop-blur-sm backdrop-filter"
                    >
                        {header}
                    </th>
                    ))}
                    
                </tr>
            </thead>
            <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={7} className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900">
                            Loading...
                        </td>
                    </tr>
                )}
                {!isLoading && items.length === 0 && (
                    <tr>
                        <td colSpan={7} className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900">
                            No results found
                        </td>
                    </tr>
                )}
                {!isLoading && items.length > 0 && items.map((advocate, i) => {
                    // Format phone number - not a fan of this library but it works
                    const phoneNumber = parsePhoneNumber(`${advocate.phoneNumber}`, 'US')

                    return (
                    <tr className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900" key={i}>
                        <td className="py-1 border-b border-teal-800/10">{advocate.firstName}</td>
                        <td className="py-1 border-b border-teal-800/10">{advocate.lastName}</td>
                        <td className="py-1 border-b border-teal-800/10">{advocate.city}</td>
                        <td className="py-1 border-b border-teal-800/10">{advocate.degree}</td>
                        <td className="py-1 border-b border-teal-800/10">
                        {advocate.specialties.map((s, i) => (
                            <div key={i}>{s}</div>
                        ))}
                        </td>
                        <td className="py-1 border-b border-teal-800/10">{advocate.yearsOfExperience}</td>
                        <td className="py-1 border-b border-teal-800/10"><a href={`tel:${advocate.phoneNumber}`} className="font-medium hover:underline">{phoneNumber.formatNational()}</a></td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
    )
}