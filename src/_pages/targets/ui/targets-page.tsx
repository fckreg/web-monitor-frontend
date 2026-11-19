import type { Metadata } from "next";

import { arrangeByGroup } from "@/entities/group";
import { CreateGroupDialog } from "@/features/group-create";
import { DeleteGroupButton } from "@/features/group-delete";
import { RenameGroupButton } from "@/features/group-rename";
import { CreateTargetDialog } from "@/features/target-create";
import { Card } from "@/shared/ui";
import { TargetTable } from "@/widgets/target-table";

import { loadTargets } from "../api/load-targets";

const DESCRIPTION = "Группы сайтов, которые опрашивает монитор.";

export const metadata: Metadata = {
  title: "Цели",
  description: DESCRIPTION,
};

export async function TargetsPage() {
  const [targets, groups] = await loadTargets();
  const sections = arrangeByGroup(groups, targets, { includeEmpty: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Цели</h1>
          <p className="text-sm text-muted">{DESCRIPTION}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateGroupDialog />
          <CreateTargetDialog groups={groups} />
        </div>
      </div>
      {sections.length === 0 ? (
        <p className="text-sm text-muted">Групп пока нет. Создайте первую и добавьте в неё сайт.</p>
      ) : (
        sections.map((section) => (
          <Card key={section.group?.id ?? "none"}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{section.group?.name ?? "Без группы"}</h2>
              {section.group ? (
                <div className="flex flex-wrap gap-2">
                  <RenameGroupButton id={section.group.id} name={section.group.name} />
                  <DeleteGroupButton id={section.group.id} name={section.group.name} />
                </div>
              ) : null}
            </div>
            {section.items.length === 0 ? (
              <p className="text-sm text-muted">В группе пока нет сайтов.</p>
            ) : (
              <TargetTable targets={section.items} groups={groups} />
            )}
          </Card>
        ))
      )}
    </div>
  );
}
