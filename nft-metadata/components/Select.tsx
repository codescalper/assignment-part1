import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNetwork } from "@/hooks/useNetwork";
import { FaEthereum } from "react-icons/fa";
import { TbCurrencySolana } from "react-icons/tb";

const SelectNetwok = () => {
  const { isNetwork, setIsNetwork } = useNetwork();

  const handleNetworkChange = (value: string) => {
    setIsNetwork(value);
  };

  return (
    <div>
      <Select onValueChange={handleNetworkChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ethereum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ethereum">
            Ethereum <FaEthereum />
          </SelectItem>
          <SelectItem value="polygon">Polygon</SelectItem>
          <SelectItem value="solana">
            Solana <TbCurrencySolana />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectNetwok;
