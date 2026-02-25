"use client";

import { Modal } from "../../ui/Modal";
import GrupoForm from "./GrupoForm";

export default function AddGrupoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Registrar Nuevo Grupo" size="lg">
      <GrupoForm onCancel={onClose} onSave={onSave} />
    </Modal>
  );
}