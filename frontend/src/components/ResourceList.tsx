import ResourceItem from "./ResourceItem";

interface ResourceListProps {
    resources: {
        wood: number;
        wine: number;
        marble: number;
        glass: number;
        sulfur: number;
    };
}

const ResourceList = ({ resources }: ResourceListProps) => (
    <div className="flex space-x-1">
        <ResourceItem type="wood" amount={resources.wood} />
        <ResourceItem type="wine" amount={resources.wine} />
        <ResourceItem type="marble" amount={resources.marble} />
        <ResourceItem type="glass" amount={resources.glass} />
        <ResourceItem type="sulfur" amount={resources.sulfur} />
    </div>
);

export default ResourceList;