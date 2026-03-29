import { ContactCard } from "./ContactCard";
import { AddressCategory } from "./types";

interface AddressSectionProps extends AddressCategory {
  onContactClick: (id: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  title,
  icon,
  contacts,
  onContactClick,
}) => {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="font-serif text-3xl md:text-4xl">
          {title}
        </h2>
      </div>

      {/* GRID */}
      <div className="flex flex-col">
        {contacts.map((contact) => (
          
          /* IMPORTANT WRAPPER FOR CLICK + FULL HEIGHT */
          <div
            key={contact.id}
            className="h-full cursor-pointer"
            onClick={() => onContactClick(contact.id)}
          >
            <ContactCard {...contact} />
          </div>

        ))}
      </div>
    </section>
  );
};